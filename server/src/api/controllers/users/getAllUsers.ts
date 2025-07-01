import type { Request, Response } from 'express';
import getAllUsersService from '#services/users/getAllUsers.ts';

const getAllUsersController = async (req: Request, res: Response): Promise<void> => {
  const result = await getAllUsersService();

  if (result === 'INTERNAL_ERROR') {
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }

  res.status(200).json(result);
};

export default getAllUsersController;
