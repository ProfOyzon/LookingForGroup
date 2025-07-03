import type { Request, Response } from 'express';
import getService from '#services/projects/get-proj-pics.ts';

const getProjectPicturesController = async (_req: Request, res: Response): Promise<void> => {
  const projID = parseInt(_req.params.id);

  if (isNaN(projID)) {
    res.status(400).json({ message: 'Invalid project ID' });
    return;
  }

  const result = await getService(projID);

  if (result === 'INTERNAL_ERROR') {
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }

  res.status(200).json(result);
};

export default getProjectPicturesController;
