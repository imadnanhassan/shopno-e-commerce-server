import { ZodError } from 'zod';

export const handleZodError = (error: ZodError) => {
  const errors = error.errors.map((err) => ({
    path: err.path.join('.'),
    message: err.message,
  }));

  return {
    statusCode: 400,
    message: 'Validation error',
    errors,
  };
};
