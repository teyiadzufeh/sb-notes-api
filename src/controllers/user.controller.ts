import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { AuthRequest, CreateUserRequest, LoginRequest } from "../types/user.types";

export class UserController {
    constructor(private readonly userService: UserService) {}

    register = async (req: Request, res: Response) => {
        try {
            const userData: CreateUserRequest = req.body;
            const user = await this.userService.create(userData);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const loginData: LoginRequest = req.body;
            const user = await this.userService.login(loginData);
            res.json(user);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
        }
    }

    me = async (req: AuthRequest, res: Response) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        res.json(req.user);
    }
}