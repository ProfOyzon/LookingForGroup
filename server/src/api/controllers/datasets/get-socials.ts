import type { Request, Response } from 'express';
import getService from '#services/datasets/get-socials.ts';

const getSocialsController = async (_request: Request, response: Response): Promise<void> => {
  const result = await getService();

  if (result === 'INTERNAL_ERROR') {
    response.status(500).json({ message: 'Internal Server Error' });
    return;
  }

  response.status(200).json(result);
};

export default getSocialsController;
