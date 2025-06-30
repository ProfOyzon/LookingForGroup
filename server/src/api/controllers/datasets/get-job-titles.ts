import type { Request, Response } from 'express';
import getJobTitlesService from '#services/datasets/get-job-titles.ts';

const getJobTitlesController = async (_request: Request, response: Response): Promise<void> => {
  const result = await getJobTitlesService();

  if (result === 'INTERNAL_ERROR') {
    response.status(500).json({ message: 'Internal Server Error' });
    return;
  }

  response.status(200).json(result);
};

export default getJobTitlesController;
