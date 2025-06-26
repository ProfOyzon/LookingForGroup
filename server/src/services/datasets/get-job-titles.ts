import prisma from '#config/prisma.ts';
import type { ServiceError } from '#types/service-error.ts';

const getJobTitlesService = async (): Promise<string[] | ServiceError> => {
  try {
    const result = await prisma.job_titles.findMany({ select: { label: true } });

    return result.map((title) => {
      return title.label;
    });
  } catch (e) {
    console.error(`Error in getJobTitlesService: ${JSON.stringify(e)}`);

    return 'INTERNAL_ERROR';
  }
};

export default getJobTitlesService;
