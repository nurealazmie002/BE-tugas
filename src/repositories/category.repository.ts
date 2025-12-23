import prisma from '../prisma';
import type { Category } from '../generated/client';

export class CategoryRepository {
  async findAll(skip: number, take: number): Promise<Category[]> {
    return prisma.category.findMany({
      skip,
      take,
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async count(): Promise<number> {
    return prisma.category.count();
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id }
    });
  }

  async findByIdWithProducts(id: string): Promise<Category | null> {
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
  }

  async create(data: { name: string; description?: string | null }): Promise<Category> {
    return prisma.category.create({
      data: {
        name: data.name,
        description: data.description ?? null
      }
    });
  }

  async update(id: string, data: { name?: string; description?: string }): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data
    });
  }

  async remove(id: string): Promise<Category> {
    return prisma.category.delete({
      where: { id }
    });
  }

  async search(name?: string): Promise<Category[]> {
    return prisma.category.findMany({
      where: name ? {
        name: {
          contains: name,
          mode: 'insensitive'
        }
      } : {}
    });
  }
}
