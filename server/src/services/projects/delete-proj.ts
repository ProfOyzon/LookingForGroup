import prisma from '#config/prisma.ts';
import type { Prisma } from '#prisma-models/index.js';
import type { ServiceErrorSubset } from '#services/service-error.ts';

type DeleteProjectServiceError = ServiceErrorSubset<'INTERNAL_ERROR' | 'NOT_FOUND'>;

const deleteProjectService = async (
  id: string
): Promise<{ id: string } | DeleteProjectServiceError> => {
  try {
    const project = await prisma.projects.findUnique({ where: { id } });
    if (!project) return 'NOT_FOUND';

    await prisma.projects.delete({ where: { id } });
    return { id };
  } catch (e) {
    console.error('Error in deleteProjectService:', e);
    return 'INTERNAL_ERROR';
  }
};

export default deleteProjectService;
