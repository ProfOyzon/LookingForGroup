import prisma from '#config/prisma.ts';
import type { Users } from '#prisma-models/index.js';
import type { ServiceErrorSubset } from '#services/service-error.ts';

type GetUserServiceError = ServiceErrorSubset<'INTERNAL_ERROR' | 'NOT_FOUND'>;

//get user by id
export const getUserByIdService = async (userId: number): Promise<Users | GetUserServiceError> => {
  try {
    const user = await prisma.users.findUnique({
      where: { userId },
    });

    if (!user) return 'NOT_FOUND';

    return user;
  } catch (e) {
    console.error('Error in getUserByIdService:', e);
    return 'INTERNAL_ERROR';
  }
};
