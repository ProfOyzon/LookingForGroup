import prisma from '#config/prisma.ts';
import type { ServiceErrorSubset } from '#services/service-error.ts';
import type { ProjectWithFollowers } from '../../../../shared/types.ts';
import { transformProject } from '../helper/projTransform.ts';

type GetServiceError = ServiceErrorSubset<'INTERNAL_ERROR' | 'NOT_FOUND'>;

const getProjectByIdService = async (
  projectId: number,
): Promise<ProjectWithFollowers | null | GetServiceError> => {
  try {
    const project = await prisma.projects.findUnique({
      where: { projectId },
      include: {
        _count: {
          select: {
            projectFollowings: true,
          },
        },
        projectGenres: {
          include: {
            genres: true,
          },
        },
        projectTags: {
          include: {
            tags: true,
          },
        },
        projectImages: true,
        projectSocials: {
          include: {
            socials: true,
          },
        },
        jobs: true,
        members: true,
        users: true,
      },
    });

    if (!project) return 'NOT_FOUND';

    return transformProject(project);
  } catch (e) {
    console.error(`Error in getProjectByIdService: ${JSON.stringify(e)}`);

    return 'INTERNAL_ERROR';
  }
};

export default getProjectByIdService;
