import prisma from '../prisma';
import type { Category } from '../generated/client';

export const findAll = async (skip: number, take: number): Promise<Category[]> => {
  return prisma.category.findMany({
    skip,
    take,
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const count = async (): Promise<number> => {
  return prisma.category.count();
};

export const findById = async (id: string): Promise<Category | null> => {
  return prisma.category.findUnique({
    where: { id }
  });
};

export const findByIdWithProducts = async (id: string): Promise<Category | null> => {
  return prisma.category.findUnique({
    where: { id },
    include: {
      products: {
        where: {
          deletedAt: null
        }
      }
    }
  });
};

export const create = async (data: { name: string; description?: string | null }): Promise<Category> => {
  return prisma.category.create({
    data: {
      name: data.name,
      description: data.description ?? null
    }
  });
};

export const update = async (id: string, data: { name?: string; description?: string }): Promise<Category> => {
  return prisma.category.update({
    where: { id },
    data
  });
};

export const remove = async (id: string): Promise<Category> => {
  return prisma.category.delete({
    where: { id }
  });
};

export const search = async (name?: string): Promise<Category[]> => {
  return prisma.category.findMany({
    where: name ? {
      name: {
        contains: name,
        mode: 'insensitive'
      }
    } : {}
  });
};
