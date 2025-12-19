import prisma from "../prisma"; 
import type { Category } from "../generated/client"; 
import { calculateSkip, createPaginatedResponse, type PaginatedResponse } from '../utils/pagination';

export const getAllCategories = async (page: number, limit: number): Promise<PaginatedResponse<Category>> => {
  const skip = calculateSkip(page, limit);

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.category.count()
  ]);

  return createPaginatedResponse(categories, page, limit, total);
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      products: {
        where: {
          deletedAt: null
        }
      }
    }
  });

  if (!category) {
    throw new Error('Category not found');
  }

  return category;
};

export const createCategory = async (data: { name: string; description?: string }): Promise<Category> => {
  return await prisma.category.create({
    data: {
      name: data.name,
      description: data.description ?? null,
    },
  });
};

export const updateCategory = async (id: string, data: { name?: string; description?: string }): Promise<Category> => {
  await getCategoryById(id);

  return await prisma.category.update({
    where: { id },
    data,
  });
};

export const deleteCategory = async (id: string): Promise<Category> => {
  await getCategoryById(id);

  return await prisma.category.delete({
    where: { id },
  });
};

export const searchCategories = async (name?: string): Promise<Category[]> => {
    return await prisma.category.findMany({
        where: name ? {
            name: {
                contains: name,
                mode: 'insensitive' 
            }
        } : {}
    });
};