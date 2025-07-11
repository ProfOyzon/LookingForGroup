import type { UserDetail, Skill, Social } from '@looking-for-group/shared';
import prisma from '#config/prisma.ts';
import type { ServiceErrorSubset } from '#services/service-error.ts';

type GetUserServiceError = ServiceErrorSubset<'INTERNAL_ERROR' | 'NOT_FOUND'>;

export const getAllUsersService = async (): Promise<UserDetail[] | GetUserServiceError> => {
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
        academicYear: true,
        location: true,
        funFact: true,
        jobTitles: {
          select: { label: true },
        },
        majors: {
          select: { label: true },
        },
        userSkills: {
          select: {
            position: true,
            skills: {
              select: {
                skillId: true,
                label: true,
                type: true,
              },
            },
          },
          orderBy: { position: 'asc' },
        },
        userSocials: {
          select: {
            socials: {
              select: {
                websiteId: true,
                label: true,
              },
            },
          },
        },
      },
    });

    //transform the users to what needs to be outputted
    const transformedUsers: UserDetail[] = users.map((user) => ({
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      profileImage: user.profileImage,
      headline: user.headline,
      pronouns: user.pronouns,
      academicYear: user.academicYear,
      location: user.location,
      funFact: user.funFact,
      jobTitle: user.jobTitles?.label ?? null,
      major: user.majors?.label ?? null,
      skills:
        user.userSkills.length > 0
          ? user.userSkills.map(
              ({ position, skills }): Skill => ({
                skillId: skills.skillId,
                label: skills.label,
                type: skills.type,
                position,
              }),
            )
          : null,
      socials:
        user.userSocials.length > 0
          ? user.userSocials.map(
              ({ socials }): Social => ({
                websiteId: socials.websiteId,
                label: socials.label,
              }),
            )
          : null,
    }));

    return transformedUsers;
  } catch (error) {
    console.error('Error in getAllUsersService:', error);
    return 'INTERNAL_ERROR';
  }
};
