import type { Request, Response } from 'express';
import getSkillsService from '#services/datasets/get-skills.ts';

const getSkillsController = async (_request: Request, response: Response): Promise<void> => {
  const result = await getSkillsService();

  if (result === 'INTERNAL_ERROR') {
    response.status(500).json({ message: 'Internal Server Error' });
    return;
  }

  response.status(200).json(result);
};

export default getSkillsController;
