import prisma from '#config/prisma.ts';
import type { Users } from '#prisma-models/index.js';
import type { ServiceErrorSubset } from '#services/service-error.ts';

type GetUserServiceError = ServiceErrorSubset<'INTERNAL_ERROR' | 'NOT_FOUND'>;

//get username by shibboleth id
export const getUserByhibService = async (
  universityId: string,
): Promise<Users | GetUserServiceError> => {
  try {
    //findUnique
    const user = await prisma.users.findFirst({
      where: { universityId },
    });

    if (!user) return 'NOT_FOUND';

    return user;
  } catch (e) {
    console.error(`Error in getUserByhibService: ${JSON.stringify(e)}`);
    return 'INTERNAL_ERROR';
  }
};

//get all users
export const getAllUsersService = async (): Promise<Users[] | GetUserServiceError> => {
  try {
    return await prisma.users.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Error in getAllUsersService:', error);
    return 'INTERNAL_ERROR';
  }
};

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

//get user by username
export const getUserByUsernameService = async (
  username: string,
): Promise<Users | GetUserServiceError> => {
  try {
    //should be unique
    const user = await prisma.users.findFirst({
      where: { username },
    });

    return user ?? 'NOT_FOUND';
  } catch (e) {
    console.error(`Error in getUserByUsernameService: ${JSON.stringify(e)}`);
    return 'INTERNAL_ERROR';
  }
};

//get user by email
export const getUserByEmailService = async (
  ritEmail: string,
): Promise<Users | GetUserServiceError> => {
  try {
    //should be unique
    const user = await prisma.users.findFirst({
      where: { ritEmail },
    });

    return user ?? 'NOT_FOUND';
  } catch (e) {
    console.error(`Error in getUserByUsernameService: ${JSON.stringify(e)}`);
    return 'INTERNAL_ERROR';
  }
};
