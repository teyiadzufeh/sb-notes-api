import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  // Zod validation error
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation error',
      errors: err.issues.map(e => ({ field: e.path.join('.'), message: e.message })),
    });
  }

  // Known app error
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Prisma errors
  if (err instanceof Error && err.constructor.name.startsWith('Prisma')) {
    return res.status(400).json({ error: 'Database error', message: err.message });
  }

  // Unknown error
  console.error('Unexpected error:', err);
  return res.status(500).json({ error: 'Internal server error' });
}