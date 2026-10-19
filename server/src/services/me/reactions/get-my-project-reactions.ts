import type { MyProjectReaction, ProjectReactionType } from '@looking-for-group/shared';
import prisma from '#config/prisma.ts';
import type { ServiceErrorSubset } from '#services/service-outcomes.ts';

type GetReactionsServiceError = ServiceErrorSubset<'INTERNAL_ERROR'>;

//GET api/me/reactions/projects
//gets every project reaction the user has left, so cards can show which ones are theirs
export const getMyProjectReactionsService = async (
  userId: number,
): Promise<MyProjectReaction[] | GetReactionsServiceError> => {
  try {
    const reactions = await prisma.projectReactions.findMany({
      where: { userId },
      select: {
        projectId: true,
        reaction: true,
      },
    });

    return reactions.map(({ projectId, reaction }) => ({
      projectId,
      reaction: reaction as ProjectReactionType,
    }));
  } catch (error) {
    console.error('Error in getMyProjectReactionsService:', error);
    return 'INTERNAL_ERROR';
  }
};
