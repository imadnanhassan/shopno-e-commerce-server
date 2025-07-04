import { AppError } from './AppError';

export class UnauthorizeError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401);
  }
}
