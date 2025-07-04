import { Request, Response, NextFunction } from 'express';
import { AppError } from './AppError';

export const notFoundRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};
