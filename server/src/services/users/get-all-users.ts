import prisma from '#config/prisma.ts';
import type { ServiceErrorSubset } from '#services/service-error.ts';

type GetUserServiceError = ServiceErrorSubset<'INTERNAL_ERROR' | 'NOT_FOUND'>;

type UserResponse = {
  userId: number;
  firstName: string;
  lastName: string;
  username: string;
  profileImage: string | null;
  headline: string | null;
  pronouns: string | null;
  job_title: string | null;
  major: string | null;
  academic_year: string | null;
  location: string | null;
  funFact: string | null;
};

export const getAllUsersService = async (): Promise<UserResponse[] | GetUserServiceError> => {
  try {
    const users = await prisma.users.findMany({
      where: { visibility: 1 },
      orderBy: { createdAt: 'desc' },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        username: true,
        profileImage: true,
        headline: true,
        pronouns: true,
        academic_year: true,
        location: true,
        funFact: true,
        jobTitles: {
          select: { label: true },
        },
        majors: {
          select: { label: true },
        },
      },
    });

    //transform the users to what needs to be outputed
    const transformedUsers: UserResponse[] = users.map((user) => ({
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      profileImage: user.profileImage,
      headline: user.headline,
      pronouns: user.pronouns,
      academic_year: user.academic_year ?? null,
      location: user.location,
      funFact: user.funFact,
      job_title: user.jobTitles?.label ?? null,
      major: user.majors?.label ?? null,
    }));

    return transformedUsers;
  } catch (error) {
    console.error('Error in getAllUsersService:', error);
    return 'INTERNAL_ERROR';
  }
};
