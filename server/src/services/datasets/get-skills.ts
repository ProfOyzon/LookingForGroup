import prisma from '#config/prisma.ts';
import type { skills } from '#prisma-models/index.js';
import type { ServiceErrorSubset } from '#services/service-error.ts';

type GetSkillsServiceError = ServiceErrorSubset<'INTERNAL_ERROR'>;

const getSkillsService = async (): Promise<skills[] | GetSkillsServiceError> => {
  try {
    return await prisma.skills.findMany({
      where: {
        type: 'Developer',
      },
      select: {
        skill_id: true,
        label: true,
        type: true,
      },
    });
  } catch (e) {
    console.error(`Error in getSkillsService: ${JSON.stringify(e)}`);

    return 'INTERNAL_ERROR';
  }
};

export default getSkillsService;
