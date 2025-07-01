import prisma from '#config/prisma.ts';
import type { Projects } from '#prisma-models/index.js';
import type { ServiceErrorSubset } from '#services/service-error.ts';

type GetServiceError = ServiceErrorSubset<'INTERNAL_ERROR'>;

const getProjectByIdService = async (
  projectId: number,
): Promise<Projects | null | GetServiceError> => {
  try {
    const project = await prisma.projects.findUnique({
      where: { projectId },
      include: {
        projectGenres: true,
        projectTags: true,
        projectImages: true,
        projectSocials: true,
        jobs: true,
        members: true,
        users: true,
      },
    });

    return project;
  } catch (e) {
    console.error(`Error in getProjectByIdService: ${JSON.stringify(e)}`);

    return 'INTERNAL_ERROR';
  }
};

export default getProjectByIdService;
