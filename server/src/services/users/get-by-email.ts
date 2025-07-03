import prisma from '#config/prisma.ts';
import type { ServiceErrorSubset } from '#services/service-error.ts';

type GetUserServiceError = ServiceErrorSubset<'INTERNAL_ERROR' | 'NOT_FOUND'>;

//show only preview data
type UserPreview = {
  userId: number;
  firstName: string;
  lastName: string;
  username: string;
  profileImage: string | null;
};

//get user by email
export const getUserByEmailService = async (
  ritEmail: string,
): Promise<UserPreview | GetUserServiceError> => {
  try {
    //should be unique
    const user = await prisma.users.findFirst({
      where: { ritEmail },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        username: true,
        profileImage: true,
      },
    });

    if (!user) return 'NOT_FOUND';

    return user;
  } catch (e) {
    console.error(`Error in getUserByUsernameService: ${JSON.stringify(e)}`);
    return 'INTERNAL_ERROR';
  }
};
