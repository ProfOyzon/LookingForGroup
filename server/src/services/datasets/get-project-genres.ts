import prisma from '#config/prisma.ts';
import type { Genres } from '#prisma-models/index.js';
import type { ServiceErrorSubset } from '#services/service-error.ts';

type GetGenresSrviceError = ServiceErrorSubset<'INTERNAL_ERROR'>;

const getGenreService = async (): Promise<Genres[] | GetGenresSrviceError> => {
  try {
    return await prisma.genres.findMany({
      select: {
        typeId: true,
        label: true,
      },
    });
  } catch (e) {
    console.error(`Error in getGenreService: ${JSON.stringify(e)}`);

    return 'INTERNAL_ERROR';
  }
};

export default getGenreService;
