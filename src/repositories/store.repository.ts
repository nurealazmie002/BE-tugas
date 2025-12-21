import prisma from '../prisma';
import type { Store, Prisma, Product } from '../generated/client';

const userSelect = {
  username: true,
  email: true
};

type StoreWithProducts = Store & { products: Product[] };

export const findAll = async (skip: number, take: number): Promise<Store[]> => {
  return prisma.store.findMany({
    skip,
    take,
    include: {
      user: {
        select: userSelect
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const count = async (): Promise<number> => {
  return prisma.store.count();
};

export const findById = async (id: string): Promise<Store | null> => {
  return prisma.store.findUnique({
    where: { id }
  });
};

export const findByIdWithProducts = async (id: string): Promise<StoreWithProducts | null> => {
  return prisma.store.findUnique({
    where: { id },
    include: {
      products: true
    }
  });
};

export const create = async (data: {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
  userId: string;
}): Promise<Store> => {
  return prisma.store.create({
    data
  });
};

export const update = async (id: string, data: Prisma.StoreUpdateInput): Promise<Store> => {
  return prisma.store.update({
    where: { id },
    data
  });
};

export const remove = async (id: string): Promise<Store> => {
  return prisma.store.delete({
    where: { id }
  });
};

export const search = async (
  keyword: string,
  skip: number,
  take: number
): Promise<Store[]> => {
  return prisma.store.findMany({
    skip,
    take,
    where: {
      OR: [
        { name: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
        { address: { contains: keyword, mode: 'insensitive' } }
      ]
    },
    include: {
      user: {
        select: userSelect
      }
    }
  });
};

export const searchCount = async (keyword: string): Promise<number> => {
  return prisma.store.count({
    where: {
      OR: [
        { name: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
        { address: { contains: keyword, mode: 'insensitive' } }
      ]
    }
  });
};
