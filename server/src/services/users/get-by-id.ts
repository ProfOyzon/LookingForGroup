import prisma from '#config/prisma.ts';
import type { ServiceErrorSubset } from '#services/service-error.ts';

type GetUserServiceError = ServiceErrorSubset<'INTERNAL_ERROR' | 'NOT_FOUND'>;

// for skills
type Skill = {
  id: number;
  type: string;
  skill: string;
  position: number;
};

// for socials
type Social = {
  websiteId: number;
  label: string;
};

//show only non-sensitive data
type UserDetail = {
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
  bio: string | null;
  skills: Skill[] | null;
  socials: Social[] | null;
};

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
        academic_year: true,
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
                skill_id: true,
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
      academic_year: user.academic_year ?? null,
      location: user.location,
      funFact: user.funFact,
      bio: user.bio,
      job_title: user.jobTitles?.label ?? null,
      major: user.majors?.label ?? null,
      skills:
        user.userSkills.length > 0
          ? user.userSkills.map(({ position, skills }) => ({
              id: skills.skill_id,
              skill: skills.label,
              type: skills.type,
              position,
            }))
          : null,
      socials:
        user.userSocials.length > 0
          ? user.userSocials.map(({ socials }) => ({
              websiteId: socials.websiteId,
              label: socials.label,
            }))
          : null,
    };

    return transformedUser;
  } catch (e) {
    console.error('Error in getUserByIdService:', e);
    return 'INTERNAL_ERROR';
  }
};
