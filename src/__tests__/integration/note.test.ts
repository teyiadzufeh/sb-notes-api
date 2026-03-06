import request from 'supertest';
import app from '../../app';
import { cleanDb, disconnectDb } from '../helpers/db';
import { createTestUser } from '../helpers/auth';
import prisma from '../../config/database';

describe('Notes API', () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    await cleanDb();
    const { user, token: t } = await createTestUser();
    token = t;
    userId = user.id;
  });

  afterAll(async () => {
    await cleanDb();
    await disconnectDb();
  });

  describe('GET /api/notes', () => {
    it('returns 401 without a token', async () => {
      const res = await request(app).get('/api/notes');
      expect(res.status).toBe(401);
    });

    it('returns only the notes for the authenticated user', async () => {
      await prisma.note.createMany({
        data: [
          { title: 'Jackie', userId },
          { title: '1984', userId },
        ],
      });

      // create another user with their own note
      const { user: otherUser } = await createTestUser('other@test.com');
      await prisma.note.create({ data: { title: 'Other Note', userId: otherUser.id } });

      const res = await request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);                   // only sees their own notes
      expect(res.body.data.map((n: any) => n.title)).toEqual(expect.arrayContaining(['Jackie', '1984']));
    });
  });

  describe('POST /api/notes', () => {
    it('creates a note for the authenticated user', async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Jackie', content: 'Is her name' });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Jackie');
      expect(res.body.userId).toBe(userId);
    });

    it('returns 400 when title is missing', async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Is her name' });

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/notes/:id', () => {
    it('deletes a note belonging to the user', async () => {
      const note = await prisma.note.create({ data: { title: 'Jackie', userId } });

      const res = await request(app)
        .delete(`/api/notes/${note.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    it('returns 404 when trying to delete another users note', async () => {
      const { user: otherUser } = await createTestUser('other@test.com');
      const note = await prisma.note.create({ data: { title: 'Jackie', userId: otherUser.id } });

      const res = await request(app)
        .delete(`/api/notes/${note.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404); // can't see or delete other user's notes
    });
  });
});