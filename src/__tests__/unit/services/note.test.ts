import { PrismaClient } from "../../../generated/prisma/client";
import { NoteService } from "../../../services/note.service";

const mockPrisma = {
    note: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findFirst: jest.fn(),
        updateMany: jest.fn(),
        deleteMany: jest.fn()
    },
} as unknown as PrismaClient;

const noteService = new NoteService(mockPrisma);


//JUST TWO TESTS TO SHOW UNIT TEST STRUCTURE
describe('NoteService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('create', () => {
        it('creates a new note for a user', async () => {
            const mockNote = {
                id: '150dbc70-a02c-4de9-88b7-32da05972759',
                title: 'A heartfelt note',
                content: 'I am doing more now than before',
                userId: '904121b9-3419-4500-bcad-4f954cea000c'
            };
            (mockPrisma.note.create as jest.Mock).mockResolvedValue(mockNote);

            const note = await noteService.create({
                title: 'A heartfelt note',
                content: 'I am doing more now than before'
            }, '904121b9-3419-4500-bcad-4f954cea000c');

            expect(mockPrisma.note.create).toHaveBeenCalledWith({
                data: {
                    title: 'A heartfelt note',
                    content: 'I am doing more now than before',
                    userId: '904121b9-3419-4500-bcad-4f954cea000c'
                }
            });
            expect(note).toEqual(mockNote);
        });
    });

    describe('findAllByUserId', () => {
        it('returns all notes for a specific user', async () => {
            const mockNotes = [{
                id: '150dbc70-a02c-4de9-88b7-32da05972759',
                title: 'A heartfelt note',
                content: 'I am doing more now than before',
                userId: '904121b9-3419-4500-bcad-4f954cea000c'
            }];
            (mockPrisma.note.findMany as jest.Mock).mockResolvedValue(mockNotes);
            (mockPrisma.note.count as jest.Mock).mockResolvedValue(1);

            const notes = await noteService.findAllByUserId('904121b9-3419-4500-bcad-4f954cea000c', 1, 10);

            expect(mockPrisma.note.findMany).toHaveBeenCalledWith({
                where: { userId: '904121b9-3419-4500-bcad-4f954cea000c' },
                skip: 0,
                take: 10,
                orderBy: { createdAt: 'desc' }
            });
            expect(mockPrisma.note.count).toHaveBeenCalledWith({ where: { userId: '904121b9-3419-4500-bcad-4f954cea000c' } });
            expect(notes).toEqual({ notes: mockNotes, total: 1 });
        })
    });
})