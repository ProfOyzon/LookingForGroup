import type { Request, Response } from 'express';
import { getUserByIdService } from '#services/users/get-by-id.ts';

//get user by id
export const getUsernameById = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid user ID' });
    return;
  }

  const result = await getUserByIdService(id);

  if (result === 'INTERNAL_ERROR') {
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }

  if (result === 'NOT_FOUND') {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  res.status(200).json(result);
};
