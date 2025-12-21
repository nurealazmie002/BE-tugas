import type { Category } from '../generated/client';
import { calculateSkip, createPaginatedResponse, type PaginatedResponse } from '../utils/pagination';
import * as CategoryRepository from '../repositories/category.repository';

export const getAllCategories = async (page: number, limit: number): Promise<PaginatedResponse<Category>> => {
  const skip = calculateSkip(page, limit);

  const [categories, total] = await Promise.all([
    CategoryRepository.findAll(skip, limit),
    CategoryRepository.count()
  ]);

  return createPaginatedResponse(categories, page, limit, total);
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const category = await CategoryRepository.findByIdWithProducts(id);

  if (!category) {
    throw new Error('Category not found');
  }

  return category;
};

export const createCategory = async (data: { name: string; description?: string }): Promise<Category> => {
  return CategoryRepository.create({
    name: data.name,
    description: data.description ?? null
  });
};

export const updateCategory = async (id: string, data: { name?: string; description?: string }): Promise<Category> => {
  await getCategoryById(id);

  return CategoryRepository.update(id, data);
};

export const deleteCategory = async (id: string): Promise<Category> => {
  await getCategoryById(id);

  return CategoryRepository.remove(id);
};

export const searchCategories = async (name?: string): Promise<Category[]> => {
  return CategoryRepository.search(name);
};