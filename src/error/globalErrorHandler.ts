/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { AppError } from './AppError';

import { handleZodError } from './zodError';
import logError from '../utils/logger';
import { sendResponse } from '../utils/sendResponse';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';
  let status = err.status || 'error';

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const zodError = handleZodError(err);
    statusCode = zodError.statusCode;
    message = zodError.message;
    status = 'fail';
  }
  // Handle AppError or custom errors
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    status = err.status;
  }
  // Handle MongoDB duplicate key error
  else if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    statusCode = 400;
    message = `Duplicate value for ${field}: ${err.keyValue[field]}`;
    status = 'fail';
  }
  // Handle MongoDB CastError
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
    status = 'fail';
  }
  // Handle MongoDB connection errors
  else if (
    err.name === 'MongoServerError' ||
    err.name === 'MongooseServerSelectionError'
  ) {
    statusCode = 503;
    message = 'Database connection error. Please try again later.';
    status = 'error';
  }
  // Handle JWT errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    status = 'fail';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    status = 'fail';
  }
  // Log unexpected errors
  else {
    logError(err);
  }

  sendResponse(res, {
    success: false,
    statusCode,
    message,
    data: null,
  });
};
