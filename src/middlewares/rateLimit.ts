import rateLimit from 'express-rate-limit';
import { AppError } from '../error/AppError';
import { NextFunction, Request, Response } from 'express';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handler: (req: Request, res: Response, next: NextFunction) => {
    throw new AppError('Too many requests, please try again later', 429);
  },
});
