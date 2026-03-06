import { CreateUserRequest, LoginRequest } from "../types/user.types";
import defaultPrisma from '../config/database';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { PrismaClient } from "../generated/prisma/client";

export class UserService {
    constructor(private readonly prisma: PrismaClient = defaultPrisma) {}

    async create(userData: CreateUserRequest) {
        const existingUser = await this.findByEmail(userData.email);

        if (existingUser) {
            throw new Error('User already exists');
        }

        //hash password
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                password: hashedPassword
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,                
                createdAt: true,
                updatedAt: true
            }
        });

        return user;
    }

    async login(loginData: LoginRequest) {
        const user = await this.findByEmail(loginData.email);

        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(loginData.password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        //return user without password and with token that can be used for authentication using the functions in src/utils/jwt.ts
        const { password, ...userWithoutPassword } = user;
        const accessToken = generateAccessToken({ userId: user.id, email: user.email });
        const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

        return { ...userWithoutPassword, accessToken, refreshToken };
    }

    async findById(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return user;
    }

    //private because we want only methods inside this class finding users by email
    private async findByEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                password: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return user;
    }

    //to be used by ADMIN users if the role is implemented in the future
    async findAll() {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return users;
    }
}