import type { Request, Response } from 'express';
import getUserByIdService from '#services/users/getUserById.ts';

const getUsernameByIdController = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);

  const result = await getUserByIdService(id);

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

export default getUsernameByIdController;
