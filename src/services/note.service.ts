import defaultPrisma from '../config/database';
import { PrismaClient } from '../generated/prisma/client';
import { CreateNoteRequest, UpdateNoteRequest } from "../types/note.types";

export class NoteService {
    constructor(private readonly prisma: PrismaClient = defaultPrisma) {}

    async create(noteData: CreateNoteRequest, userId: string) {   
        const note = await this.prisma.note.create({
            data: {
                title: noteData.title,
                content: noteData.content,
                userId
            }
        });
        return note;
    }

    async findAllByUserId(userId: string, page: number = 1, limit: number = 10) {
        const notes = await this.prisma.note.findMany({
            where: { userId },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' }
        });
        const totalNotes = await this.prisma.note.count({ where: { userId } });
        return { notes, total: totalNotes };
    }

    async findById(noteId: string, userId: string) {
        const note = await this.prisma.note.findFirst({
            where: { id: noteId, userId }
        });
        return note;
    }

    async update(noteId: string, noteData: Partial<UpdateNoteRequest>, userId: string) {
        const foundNote = await this.findById(noteId, userId);
        if (!foundNote) {
            return null;
        }
        const note = await this.prisma.note.updateMany({
            where: { id: noteId, userId },
            data: {
                title: noteData.title,
                content: noteData.content
            }
        });

        return note;
    }

    async delete(noteId: string, userId: string) {
        const foundNote = await this.findById(noteId, userId);
        if (!foundNote) {
            return null;
        }
        const note = await this.prisma.note.deleteMany({
            where: { id: noteId, userId }
        });
        return note;
    }
}