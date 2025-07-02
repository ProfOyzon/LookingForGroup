import type { Request, Response } from 'express';
import { getUserByUsernameService } from '#services/users/get-by-username.ts';

//get the user by the username
export const getUserByUsername = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;

  const result = await getUserByUsernameService(username);

  if (result === 'INTERNAL_ERROR') {
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }

  if (result === 'NOT_FOUND') {
    res.status(500).json({ message: 'User not found' });
    return;
  }

  res.status(200).json(result);
};
