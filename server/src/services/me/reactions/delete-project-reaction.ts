import type { ProjectReactionType } from '@looking-for-group/shared';
import prisma from '#config/prisma.ts';
import type { ServiceErrorSubset, ServiceSuccessSubset } from '#services/service-outcomes.ts';

type DeleteReactionServiceError = ServiceErrorSubset<'INTERNAL_ERROR' | 'NOT_FOUND'>;
type DeleteReactionServiceSuccess = ServiceSuccessSubset<'NO_CONTENT'>;

//DELETE api/me/reactions/projects/{id}/{reaction}
//removes the user's reaction from a project
export const deleteProjectReactionService = async (
  userId: number,
  projectId: number,
  reaction: ProjectReactionType,
): Promise<DeleteReactionServiceError | DeleteReactionServiceSuccess> => {
  try {
    const { count } = await prisma.projectReactions.deleteMany({
      where: {
        userId,
        projectId,
        reaction,
      },
    });

    //the user never used this reaction on this project
    if (count === 0) return 'NOT_FOUND';

    return 'NO_CONTENT';
  } catch (error) {
    console.error('Error in deleteProjectReactionService:', error);
    return 'INTERNAL_ERROR';
  }
};
