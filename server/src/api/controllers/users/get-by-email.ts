import type { Request, Response } from 'express';
import { getUserByEmailService } from '#services/users/get-by-email.ts';

//get the user by the email
export const getUserByEmail = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.params;

  const result = await getUserByEmailService(email);

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
