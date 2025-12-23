import type { Category } from '../generated/client';
import { calculateSkip, createPaginatedResponse, type PaginatedResponse } from '../utils/pagination';
import { CategoryRepository } from '../repositories/category.repository';
import type { ICreateCategory, IUpdateCategory } from '../models';

export class CategoryService {
  constructor(private repository: CategoryRepository) {}

  async getAllCategories(page: number, limit: number): Promise<PaginatedResponse<Category>> {
    const skip = calculateSkip(page, limit);

    const [categories, total] = await Promise.all([
      this.repository.findAll(skip, limit),
      this.repository.count()
    ]);

    return createPaginatedResponse(categories, page, limit, total);
  }

  async getCategoryById(id: string): Promise<Category> {
    const category = await this.repository.findByIdWithProducts(id);

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  async createCategory(data: ICreateCategory): Promise<Category> {
    return this.repository.create({
      name: data.name,
      description: data.description ?? null
    });
  }

  async updateCategory(id: string, data: IUpdateCategory): Promise<Category> {
    await this.getCategoryById(id);

    return this.repository.update(id, data);
  }

  async deleteCategory(id: string): Promise<Category> {
    await this.getCategoryById(id);

    return this.repository.remove(id);
  }

  async searchCategories(name?: string): Promise<Category[]> {
    return this.repository.search(name);
  }
}