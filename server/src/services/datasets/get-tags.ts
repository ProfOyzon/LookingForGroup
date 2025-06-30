import prisma from '#config/prisma.ts';
import type { Tags } from '#prisma-models/index.js';
import type { ServiceErrorSubset } from '#services/service-error.ts';

type GetTagsServiceError = ServiceErrorSubset<'INTERNAL_ERROR'>;

const getTagsService = async (): Promise<Tags[] | GetTagsServiceError> => {
  try {
    return await prisma.tags.findMany({
      select: {
        tagId: true,
        label: true,
        type: true,
      },
    });
  } catch (e) {
    console.error(`Error in getTagsService: ${JSON.stringify(e)}`);

    return 'INTERNAL_ERROR';
  }
};

export default getTagsService;
