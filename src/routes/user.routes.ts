import { Router } from 'express';
import { UserService } from '../services/user.service';
import { createUserSchema, loginSchema } from '../types/user.types';
import { UserController } from '../controllers/user.controller';
import { authenticate, validate } from '../middleware';

const userRouter = Router();
const userService = new UserService();
const userController = new UserController(userService);

userRouter.post('/register', validate(createUserSchema), userController.register);

userRouter.post('/login', validate(loginSchema), userController.login);

userRouter.get('/me', authenticate, userController.me);

export default userRouter;