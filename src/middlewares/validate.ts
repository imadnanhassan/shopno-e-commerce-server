import { Request, Response, NextFunction } from 'express';
import { z, AnyZodObject } from 'zod';
import { AppError } from '../error/AppError';

export const validate = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        throw new AppError(`Validation failed: ${errorMessage}`, 400);
      }
      throw new AppError('Validation error', 400);
    }
  };
};
