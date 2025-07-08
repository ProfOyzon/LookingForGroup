import type { Request, Response } from 'express';
import { getUserByhibService } from '#services/users/get-user-shib.ts';

//get username by shibbolth
export const getUsernameByShib = async (req: Request, res: Response): Promise<void> => {
  const universityId = req.headers['uid'] as string | undefined;

  if (!universityId) {
    res.status(400).json({ message: 'Missing university ID in headers' });
    return;
  }

  const result = await getUserByhibService(universityId);

  if (result === 'INTERNAL_ERROR') {
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }

  if (result === 'NOT_FOUND') {
    res.status(200).json({ message: 'User not found' });
    // res.status(200).json({ username: null, loggedIn: false});
    return;
  }

  res.status(200).json({ username: result.username, loggedIn: true });
};
