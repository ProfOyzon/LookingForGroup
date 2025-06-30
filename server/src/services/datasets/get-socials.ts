import prisma from '#config/prisma.ts';
import type { Socials } from '#prisma-models/index.js';
import type { ServiceErrorSubset } from '#services/service-error.ts';

type GetSocialsServiceError = ServiceErrorSubset<'INTERNAL_ERROR'>;

const getSocialsService = async (): Promise<Socials[] | GetSocialsServiceError> => {
  try {
    return await prisma.socials.findMany({
      select: {
        websiteId: true,
        label: true,
      },
    });
  } catch (e) {
    console.error(`Error in getSocialsService: ${JSON.stringify(e)}`);

    return 'INTERNAL_ERROR';
  }
};

export default getSocialsService;
