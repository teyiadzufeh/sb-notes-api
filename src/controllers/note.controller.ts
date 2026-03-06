import { Response } from "express";
import { NoteService } from "../services/note.service";
import { AuthRequest } from "../types/user.types";
import { CreateNoteRequest } from "../types/note.types";

export class NoteController {
    constructor(private readonly noteService: NoteService) {}

    create = async (req: AuthRequest, res: Response) => {
        try {
            const noteData: CreateNoteRequest = req.body;
            const note = await this.noteService.create(noteData, req.user!.userId);
            res.status(201).json(note);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
        }
    };

    getAllByUserId = async (req: AuthRequest, res: Response) => {
        try {
            const page = Number.parseInt(req.query.page as string) || 1;
            const limit = Number.parseInt(req.query.limit as string) || 10;
            const notes = await this.noteService.findAllByUserId(req.user!.userId, page, limit);
            if (!notes) {
                return res.status(404).json({ error: 'No notes found' });
            }
            res.json({
                data: notes.notes,
                page,
                limit,
                total: notes.total,
                lastPage: Math.ceil(notes.total / limit),
                last: page * limit >= notes.total
            });
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
        }
    };

    getSingle = async (req: AuthRequest, res: Response) => {
        try {
            const note = await this.noteService.findById(req.params.id as string, req.user!.userId);
            if (!note) {
                return res.status(404).json({ error: 'Note not found' });
            }
            res.json(note);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
        }
    };

    update = async (req: AuthRequest, res: Response) => {
        try {
            const noteData: CreateNoteRequest = req.body;
            const note = await this.noteService.update(req.params.id as string, noteData, req.user!.userId);
            if (!note) {
                return res.status(404).json({ error: 'Note not found' });
            }
            res.json({ message: 'Note updated successfully' });
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
        }
    };

    delete = async (req: AuthRequest, res: Response) => {
        try {
            const note = await this.noteService.delete(req.params.id as string, req.user!.userId);
            if (!note) {
                return res.status(404).json({ error: 'Note not found' });
            }
            res.json({ message: 'Note deleted successfully' });
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
        }
    };
}