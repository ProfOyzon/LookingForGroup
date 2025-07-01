import type { Request, Response } from 'express';
import getUserByhibService from '#services/users/getUserByShib.ts';

const getUsernameByShibController = async (req: Request, res: Response): Promise<void> => {
  //add shib headers
  const universityId = req.headers['x-university-id'] as string | undefined;

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
    res.status(500).json({ message: 'User not found' });
    return;
  }

  res.status(200).json({ username: result.username });
};

export default getUsernameByShibController;
