import type { RequestHandler } from 'express';
import { getUserByUsernameService } from '#services/users/get-by-username.ts';
import { updateUserUsernameService } from '#services/users/update-username.ts';

export const updateUsername: RequestHandler<
  { id: string },
  unknown,
  { username?: string }
> = async (req, res) => {
  const { id } = req.params;
  const { username: newUsername } = req.body;

  //validate ID
  const userId = parseInt(id);
  if (isNaN(userId)) {
    res.status(400).json({ message: 'Invalid user ID' });
    return;
  }

  //validate new username
  if (!newUsername || newUsername.trim() === '') {
    res.status(400).json({ message: 'New username not found' });
    return;
  }

  //check if username exists
  const userExist = await getUserByUsernameService(newUsername);
  if (userExist !== 'NOT_FOUND' && userExist !== 'INTERNAL_ERROR' && userExist.userId !== userId) {
    res.status(409).json({ message: 'Username already taken' });
    return;
  }

  //update username
  const result = await updateUserUsernameService(userId, newUsername);

  if (result === 'NOT_FOUND') {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  if (result === 'INTERNAL_ERROR') {
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }

  res.status(200).json(result);
};
