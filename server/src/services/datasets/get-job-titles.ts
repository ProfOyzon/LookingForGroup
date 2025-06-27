import prisma from '#config/prisma.ts';
import type { ServiceErrorSubtype } from '#services/service-error.ts';

type GetJobTitlesServiceError = ServiceErrorSubtype<'INTERNAL_ERROR'>;

const getJobTitlesService = async (): Promise<string[] | GetJobTitlesServiceError> => {
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
