import { Router } from 'express';
import { NoteService } from '../services/note.service';
import { createNoteSchema, updateNoteSchema } from '../types/note.types';
import { NoteController } from '../controllers/note.controller';
import { authenticate, validate } from '../middleware';

const noteRouter = Router();
const noteService = new NoteService();
const noteController = new NoteController(noteService);

noteRouter.post('/', validate(createNoteSchema), authenticate, noteController.create);

noteRouter.get('/', authenticate, noteController.getAllByUserId);

noteRouter.get('/:id', authenticate, noteController.getSingle);

noteRouter.put('/:id', validate(updateNoteSchema), authenticate, noteController.update);

noteRouter.delete('/:id', authenticate, noteController.delete);

export default noteRouter;