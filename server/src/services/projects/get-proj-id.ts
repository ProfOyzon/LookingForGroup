import prisma from '#config/prisma.ts';
import type { ServiceErrorSubset } from '#services/service-error.ts';
import type { ProjectWithFollowers } from '../../../../shared/types.ts';

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
        members: {
          select: {
            projectId: true,
            userId: true,
            titleId: true,
            //permission: true,
          },
        },
        users: true,
      },
    });

    if (!project) return 'NOT_FOUND';

    const projectsWithFollowers: ProjectWithFollowers = {
      ...project,
      thumbnail: project.thumbnail,
      purpose: project.purpose,
      status: project.status,
      audience: project.audience,
      userId: project.userId ?? 0,
      projectType: project.projectGenres.map((pg) => ({
        typeId: pg.typeId,
        label: pg.genres.label,
      })),
      projectTags: project.projectTags.map((pt) => ({
        projectId: pt.projectId,
        tagId: pt.tagId,
        position: pt.position,
        type: pt.tags.type,
        label: pt.tags.label,
      })),
      projectImages: project.projectImages.map((img) => ({
        imageId: img.imageId,
        image: img.image,
        altText: '',
      })),
      projectSocials: project.projectSocials.map((ps) => ({
        websiteId: ps.websiteId,
        label: ps.socials.label,
      })),
      jobs: project.jobs.map((job) => ({
        ...job,
        description: job.description ?? undefined,
      })),
      members: project.members.map((member) => ({
        projectId: member.projectId,
        userId: member.userId,
        titleId: member.titleId,
        permission: 0,
      })),
      followers: {
        count: project._count.projectFollowings,
      },
    };

    return projectsWithFollowers;
  } catch (e) {
    console.error(`Error in getProjectByIdService: ${JSON.stringify(e)}`);

    return 'INTERNAL_ERROR';
  }
};

export default getProjectByIdService;
