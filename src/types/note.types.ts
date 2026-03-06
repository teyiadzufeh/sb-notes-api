import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(5).optional(),
});

export type CreateNoteRequest = z.infer<typeof createNoteSchema>;

export const updateNoteSchema = z.object({
  title: z.string().min(3).optional(),
  content: z.string().min(5).optional(),
});

export type UpdateNoteRequest = z.infer<typeof updateNoteSchema>;

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}