import type { NextFunction, Request, Response } from 'express';
import { isLoggedInHeader, uidHeader } from '#config/constants.ts';
import envConfig from '#config/env.ts';

const requiresLogin = (request: Request, response: Response, next: NextFunction) => {
  if (envConfig.env === 'development' || envConfig.env === 'test') {
    /// Add UID for development, missing correct header
    request.headers[uidHeader] = '000000001';

    next();
    return;
  }

  if (request.headers[isLoggedInHeader] === 'true') {
    next();
    return;
  }

  response.json({ message: 'You must log in to access this resource' });
  return;
};

export default requiresLogin;
