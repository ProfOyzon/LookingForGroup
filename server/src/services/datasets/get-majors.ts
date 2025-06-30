import prisma from '#config/prisma.ts';
import type { Majors } from '#prisma-models/index.js';
import type { ServiceErrorSubset } from '#services/service-error.ts';

type GeMajorsSrviceError = ServiceErrorSubset<'INTERNAL_ERROR'>;

const getMajorsService = async (): Promise<Majors[] | GeMajorsSrviceError> => {
  try {
    return await prisma.majors.findMany({
      select: {
        majorId: true,
        label: true,
      },
    });
  } catch (e) {
    console.error(`Error in getMajorsService: ${JSON.stringify(e)}`);

    return 'INTERNAL_ERROR';
  }
};

export default getMajorsService;
