import type { Request, Response } from 'express';
import getService from '#services/projects/get-proj.ts';

const getProjectsController = async (_req: Request, res: Response): Promise<void> => {
  const result = await getService();

  if (result === 'INTERNAL_ERROR') {
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }

  res.status(200).json(result);
};

export default getProjectsController;
