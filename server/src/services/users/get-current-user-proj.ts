import prisma from '#config/prisma.ts';
import type { ServiceErrorSubset } from '#services/service-error.ts';
import type { ProjectWithFollowers } from '../../../../shared/types.js';
import { transformProject } from '../helper/projTransform.ts';

type GetProjectsError = ServiceErrorSubset<'INTERNAL_ERROR' | 'NOT_FOUND'>;

export const getMyProjectService = async (
  userId: number,
): Promise<ProjectWithFollowers[] | GetProjectsError> => {
  try {
    const projects = await prisma.projects.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { projectFollowings: true } },
        projectGenres: { include: { genres: true } },
        projectTags: { include: { tags: true } },
        projectImages: true,
        projectSocials: { include: { socials: true } },
        jobs: true,
        members: true,
        users: true,
      },
    });

    if (!projects.length) return 'NOT_FOUND';

    //user helper to tranform project
    const fullProject = projects.map(transformProject);

    return fullProject;
  } catch (e) {
    console.error(`Error in getUserFollowingService: ${JSON.stringify(e)}`);
    return 'INTERNAL_ERROR';
  }
};
