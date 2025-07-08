import type { Request, Response } from 'express';

const inDev = process.env.NODE_ENV === 'development';

const getAuth = (req: Request, res: Response): void => {
  //for development
  if (inDev) {
    res.status(200).json({ authenticated: true, username: 'Mr.Bones' });
  }

  const username = req.headers['eppn'] || req.headers['remote_user'];

  if (!username) {
    res.status(401).json({ authenticated: false, error: 'User is guest', username: 'guest' });
    return;
  }
  res.status(200).json({ authenticated: true, username: username });
};

export default getAuth;
