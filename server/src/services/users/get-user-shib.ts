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
