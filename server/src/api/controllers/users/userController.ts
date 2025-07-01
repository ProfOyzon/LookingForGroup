import type { Request, Response } from 'express';
import {
  getUserByhibService,
  getAllUsersService,
  getUserByIdService,
  getUserByUsernameService,
  getUserByEmailService,
} from '#services/users/userService.ts';

//get username by shibbolth
export const getUsernameByShib = async (req: Request, res: Response): Promise<void> => {
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

//get all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  const result = await getAllUsersService();

  if (result === 'INTERNAL_ERROR') {
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }

  res.status(200).json(result);
};

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
    res.status(500).json({ message: 'User not found' });
    return;
  }

  res.status(200).json(result);
};

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

//get the user by the email
export const getUserByEmail = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.params;

  const result = await getUserByEmailService(email);

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
