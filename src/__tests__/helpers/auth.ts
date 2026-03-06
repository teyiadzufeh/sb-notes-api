import bcrypt from 'bcrypt';
import prisma from '../../config/database';
import { generateAccessToken } from '../../utils/jwt';

export async function createTestUser(email = 'test@test.com', password = 'password123') {
  const user = await prisma.user.create({
    data: {
      email,
      firstName: 'Test User',
      lastName: 'Test',
      password: await bcrypt.hash(password, 10),
    },
  });

  const token = generateAccessToken({ userId: user.id, email});

  return { user, token };
}