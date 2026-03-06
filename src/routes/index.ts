import { Application } from 'express';
import userRouter from './user.routes';
import noteRouter from './note.routes';

export function createRoutes(app: Application) {
    // Mount routes
    app.use('/api/users', userRouter);
    app.use('/api/notes', noteRouter);
}