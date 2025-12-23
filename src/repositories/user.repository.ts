import prisma from '../prisma';
import type { Prisma, User } from '../generated/client';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        id,
        deletedAt: null
      }
    });
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        deletedAt: null
      }
    });
  }

  async create(data: {
    username: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<User> {
    return prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role ?? 'USER'
      }
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data
    });
  }

  async softDelete(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });
  }
}
