import prisma from '#config/prisma.ts';
import type { ServiceErrorSubset } from '#services/service-error.ts';
import type { UserDetail, Skill, Social } from '../../../../shared/types.ts';

type GetUserServiceError = ServiceErrorSubset<'INTERNAL_ERROR' | 'NOT_FOUND'>;

//get user by id
export const getUserByIdService = async (
  userId: number,
): Promise<UserDetail | GetUserServiceError> => {
  try {
    const user = await prisma.users.findUnique({
      where: { userId },
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
        bio: true,
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

    if (!user) return 'NOT_FOUND';

    //transform to the user to be outputted
    const transformedUser: UserDetail = {
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
      bio: user.bio,
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
    };

    return transformedUser;
  } catch (e) {
    console.error('Error in getUserByIdService:', e);
    return 'INTERNAL_ERROR';
  }
};
