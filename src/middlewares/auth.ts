import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizeError } from '../error/unauthorizeError';
import { env } from '../config/env';

interface JwtPayload {
  id: string;
  role: string;
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new UnauthorizeError('No token provided');
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'name' in error &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).name === 'TokenExpiredError'
    ) {
      throw new UnauthorizeError('Token expired');
    }
    throw new UnauthorizeError('Invalid token');
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new UnauthorizeError(
        'You do not have permission to perform this action'
      );
    }
    next();
  };
};
