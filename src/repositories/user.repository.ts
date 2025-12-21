import prisma from '../prisma';
import type { Prisma, User } from '../generated/client';

export const findByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email }
  });
};

export const findById = async (id: string): Promise<User | null> => {
  return prisma.user.findFirst({
    where: {
      id,
      deletedAt: null
    }
  });
};

export const findAll = async (): Promise<User[]> => {
  return prisma.user.findMany({
    where: {
      deletedAt: null
    }
  });
};

export const create = async (data: {
  username: string;
  email: string;
  password: string;
  role?: string;
}): Promise<User> => {
  return prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role ?? 'USER'
    }
  });
};

export const update = async (id: string, data: Prisma.UserUpdateInput): Promise<User> => {
  return prisma.user.update({
    where: { id },
    data
  });
};

export const softDelete = async (id: string): Promise<User> => {
  return prisma.user.update({
    where: { id },
    data: {
      deletedAt: new Date()
    }
  });
};
