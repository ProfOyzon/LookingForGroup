import type { Request, Response } from 'express';

const getAuth = (req: Request, res: Response): void => {
  const username = req.headers['eppn'] || req.headers['remote_user'];

  if (!username) {
    res.status(200).json({ authenticated: false, error: 'User is guest', username: 'guest' });
    return;
  }
  res.status(200).json({ authenticated: true, username: username });
};

export default getAuth;
