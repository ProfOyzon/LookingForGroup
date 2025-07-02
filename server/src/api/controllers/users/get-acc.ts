import type { Request, Response } from 'express';
import { getUserAccountService } from '#services/users/get-user-acc.ts';

export const getAccount = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    res.status(400).json({ message: 'Invalid user ID' });
    return;
  }

  const result = await getUserAccountService(userId);

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
