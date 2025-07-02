import prisma from '#config/prisma.ts';
import type { ServiceErrorSubset } from '#services/service-error.ts';

type UpdateUserServiceError = ServiceErrorSubset<'INTERNAL_ERROR' | 'NOT_FOUND'>;

export const updateUserEmailService = async (
  userId: number,
  newEmail: string,
): Promise<{ email: string } | UpdateUserServiceError> => {
  try {
    const user = await prisma.users.update({
      where: { userId },
      data: { ritEmail: newEmail },
      select: { ritEmail: true },
    });

    return { email: user.ritEmail };
  } catch (e) {
    console.error('Error in updateUserEmailService:', e);
    return 'INTERNAL_ERROR';
  }
};
