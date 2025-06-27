import prisma from '#config/prisma.ts';
import type { JobTitles } from '#prisma-models/index.js';
import type { ServiceErrorSubset } from '#services/service-error.ts';

type GetJobTitlesServiceError = ServiceErrorSubset<'INTERNAL_ERROR'>;

const getJobTitlesService = async (): Promise<JobTitles[] | GetJobTitlesServiceError> => {
  try {
    return await prisma.jobTitles.findMany();
  } catch (e) {
    console.error(`Error in getJobTitlesService: ${JSON.stringify(e)}`);

    return 'INTERNAL_ERROR';
  }
};

export default getJobTitlesService;
