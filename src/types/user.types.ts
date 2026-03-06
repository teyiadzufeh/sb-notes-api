import { Request } from "express";
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(6),
});

export type CreateUserRequest = z.infer<typeof createUserSchema>;

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type LoginRequest = z.infer<typeof loginSchema>;

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}