import prisma from '../../config/database';

export async function cleanDb() {
  await prisma.note.deleteMany();
  await prisma.user.deleteMany();
}

export async function disconnectDb() {
  await prisma.$disconnect();
}