import type { NextFunction, Request, Response } from 'express';
import envConfig from '#config/env.ts';
import uidExistsService from '#services/users/uid-exists.ts';

const requiresLogin = async (request: Request, response: Response, next: NextFunction) => {
  if (envConfig.env === 'development') {
    /// Add UID for development, missing correct header
    request.headers['uid'] = '000000001';

    next();
    return;
  }

  const uidHeader = request.headers['uid'] as string | undefined;

  if (uidHeader === undefined) {
    response.status(401).json({ message: 'You must log in to access this resource' });
    return;
  }

  /// If the server is set up properly any defined UIDs should be valid, but better safe than sorry
  try {
    const uid = Number.parseInt(uidHeader, 10);

    const exists = await uidExistsService(uid);

    if (!exists) {
      response.json({ message: 'You must log in to access this resource' });
      return;
    }

    next();
    return;
  } catch {
    response.json({ message: 'You must log in to access this resource' });
    return;
  }
};

export default requiresLogin;
