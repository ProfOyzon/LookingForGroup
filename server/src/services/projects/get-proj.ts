import prisma from '#config/prisma.ts';
import type { Projects } from '#prisma-models/index.js';
import type { ServiceErrorSubset } from '#services/service-error.ts';

type GetServiceError = ServiceErrorSubset<'INTERNAL_ERROR'>;

const getProjectsService = async (): Promise<Projects[] | GetServiceError> => {
  try {
    return await prisma.projects.findMany({
      include: {
        projectGenres: true,
        projectTags: true,
        projectImages: true,
        projectSocials: true,
        projectFollowings: true,
        jobs: true,
        members: true,
        users: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (e) {
    console.error(`Error in getProjectsService: ${JSON.stringify(e)}`);

    return 'INTERNAL_ERROR';
  }
};

export default getProjectsService;
