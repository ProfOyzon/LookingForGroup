import type { UserFollowing } from '@looking-for-group/shared';
import prisma from '#config/prisma.ts';
import type { ServiceErrorSubset } from '#services/service-error.ts';

type GetUserServiceError = ServiceErrorSubset<'INTERNAL_ERROR' | 'NOT_FOUND'>;

//get the user by the username
export const getUserFollowingService = async (
  userId: number,
): Promise<UserFollowing[] | GetUserServiceError> => {
  try {
    return await prisma.userFollowings.findMany({
      where: { userId },
      select: {
        userId: true,
        followingId: true,
        followedAt: true,
      },
    });
  } catch (e) {
    console.error(`Error in getUserFollowingService: ${JSON.stringify(e)}`);
    return 'INTERNAL_ERROR';
  }
};
