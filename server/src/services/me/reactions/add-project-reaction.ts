import type { MyProjectReaction, ProjectReactionType } from '@looking-for-group/shared';
import prisma from '#config/prisma.ts';
import type { ServiceErrorSubset } from '#services/service-outcomes.ts';

type AddReactionServiceError = ServiceErrorSubset<'INTERNAL_ERROR' | 'NOT_FOUND' | 'CONFLICT'>;

//POST api/me/reactions/projects/{id}
//adds the user's reaction to a project
export const addProjectReactionService = async (
  userId: number,
  projectId: number,
  reaction: ProjectReactionType,
): Promise<MyProjectReaction | AddReactionServiceError> => {
  try {
    //reactions only exist on projects that are shown on the site
    const project = await prisma.projects.findFirst({
      where: {
        projectId,
        approved: true,
        globalVisibility: 'public',
      },
      select: { projectId: true },
    });

    if (!project) return 'NOT_FOUND';

    await prisma.projectReactions.create({
      data: {
        userId,
        projectId,
        reaction,
      },
    });

    return { projectId, reaction };
  } catch (error) {
    //the user already used this reaction on this project
    if (error instanceof Object && 'code' in error && error.code === 'P2002') {
      return 'CONFLICT';
    }

    console.error('Error in addProjectReactionService:', error);
    return 'INTERNAL_ERROR';
  }
};
