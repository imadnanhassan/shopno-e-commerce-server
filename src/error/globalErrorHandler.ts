import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from './AppError';
import { handleZodError } from './zodError';
import { sendResponse } from '../utils/sendResponse';
/**
 * Global error handler for Express applications.
 * This function captures errors thrown in the application and sends a standardized response.
 *
 * @param {unknown} err - The error object, which can be of any type.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response
) => {
  let statusCode = 500;
  let message = 'Something went wrong';

  type ErrorWithStatusCodeAndMessage = {
    statusCode?: number;
    message?: string;
  };
  if (
    typeof err === 'object' &&
    err !== null &&
    'statusCode' in err &&
    typeof (err as ErrorWithStatusCodeAndMessage).statusCode === 'number'
  ) {
    statusCode = (err as ErrorWithStatusCodeAndMessage).statusCode as number;
  }
  if (
    typeof err === 'object' &&
    err !== null &&
    'message' in err &&
    typeof (err as ErrorWithStatusCodeAndMessage).message === 'string'
  ) {
    message = (err as ErrorWithStatusCodeAndMessage).message as string;
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const zodError = handleZodError(err);
    statusCode = zodError.statusCode;
    message = zodError.message;
  }
  // Handle AppError or custom errors
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  sendResponse(res, {
    success: false,
    statusCode,
    message,
    data: null,
  });
};
