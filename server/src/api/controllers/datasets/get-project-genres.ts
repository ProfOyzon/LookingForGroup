import type { Request, Response } from 'express';
import getService from '#services/datasets/get-project-genres.ts';
import type { ApiResponse } from '../../../../../shared/types.ts';

const getGenresController = async (_request: Request, response: Response): Promise<void> => {
  const result = await getService();

  if (result === 'INTERNAL_ERROR') {
    const resBody: ApiResponse = {
      status: 500,
      error: 'Internal Server Error',
      data: null,
      memetype: 'application/json',
    };
    response.status(500).json(resBody);
    return;
  }

  response.status(200).json(result);
};

export default getGenresController;
