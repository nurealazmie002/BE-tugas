import prisma from '../prisma';
import type { Product, Prisma } from '../generated/client';

export class ProductRepository {
  private productInclude = {
    category: true,
    store: true
  };

  async findAll(skip: number, take: number): Promise<Product[]> {
    return prisma.product.findMany({
      skip,
      take,
      where: {
        deletedAt: null
      },
      include: this.productInclude,
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async count(where?: Prisma.ProductWhereInput): Promise<number> {
    return prisma.product.count({
      where: where ?? { deletedAt: null }
    });
  }

  async findById(id: string): Promise<Product | null> {
    return prisma.product.findFirst({
      where: {
        id,
        deletedAt: null
      },
      include: this.productInclude
    });
  }

  async create(data: {
    name: string;
    price: number;
    stock: number;
    description?: string | null;
    categoryId: string;
    storeId: string;
    image?: string | null;
  }): Promise<Product> {
    return prisma.product.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        price: data.price,
        stock: data.stock,
        categoryId: data.categoryId,
        storeId: data.storeId,
        image: data.image ?? null
      }
    });
  }

  async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data
    });
  }

  async softDelete(id: string): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });
  }

  async restore(id: string): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: {
        deletedAt: null
      }
    });
  }

  async findDeletedById(id: string): Promise<Product | null> {
    return prisma.product.findFirst({
      where: {
        id,
        NOT: { deletedAt: null }
      }
    });
  }

  async search(
    where: Prisma.ProductWhereInput,
    skip: number,
    take: number
  ): Promise<Product[]> {
    return prisma.product.findMany({
      skip,
      take,
      where,
      include: this.productInclude
    });
  }
}
