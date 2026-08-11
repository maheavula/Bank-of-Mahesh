import { Request, Response, NextFunction } from 'express';

export interface AppError {
  status?: number;
  code?: string;
  message?: string;
}

export function errorHandler(err: AppError | any, _req: Request, res: Response, _next: NextFunction): void {
  const status = err.status || 500;
  const code = err.code || 'SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred on the server.';

  if (status === 500) {
    console.error('[SERVER ERROR]', err);
  }

  res.status(status).json({
    success: false,
    error: {
      code,
      message
    }
  });
}
