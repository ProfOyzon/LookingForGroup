import type { Request, Response } from 'express';

//get the user by the username
export const getUserFollowing = (_req: Request, res: Response): void => {
  res.status(200);
};
