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

  async findAllAdvanced(
    skip: number,
    take: number,
    where: Prisma.ProductWhereInput,
    orderBy: Prisma.ProductOrderByWithRelationInput
  ): Promise<Product[]> {
    return prisma.product.findMany({
      skip,
      take,
      where,
      include: this.productInclude,
      orderBy
    });
  }

  async count(where?: Prisma.ProductWhereInput): Promise<number> {
    return prisma.product.count({
      where: where ?? { deletedAt: null }
    });
  }

  async countAll(where: Prisma.ProductWhereInput): Promise<number> {
    return prisma.product.count({ where });
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

  async findComplex(categoryName: string, maxPrice: number): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        deletedAt: null,
        OR: [
          {
            AND: [
              { category: { name: categoryName } },
              { price: { lt: maxPrice } }
            ]
          },
          { category: { name: 'Aksesoris' } }
        ]
      },
      include: this.productInclude
    });
  }

  async getStatistics(categoryId?: string) {
    const whereClause: Prisma.ProductWhereInput = {
      deletedAt: null,
      ...(categoryId && { categoryId })
    };

    return prisma.product.aggregate({
      where: whereClause,
      _count: { id: true },
      _avg: { price: true },
      _sum: { stock: true },
      _min: { price: true },
      _max: { price: true }
    });
  }

  async getProductsByCategoryStats(categoryId?: string) {
    const whereClause: Prisma.ProductWhereInput = {
      deletedAt: null,
      ...(categoryId && { categoryId })
    };

    return prisma.product.groupBy({
      by: ['categoryId'],
      where: whereClause,
      _count: { id: true },
      _avg: { price: true },
      _sum: { stock: true }
    });
  }

  async getDashboardStats() {
    return prisma.product.aggregate({
      where: { deletedAt: null },
      _count: { id: true },
      _sum: { stock: true }
    });
  }

  async getLowStockProducts(threshold: number = 10, limit: number = 5): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        deletedAt: null,
        stock: { lt: threshold }
      },
      orderBy: { stock: 'asc' },
      take: limit,
      include: this.productInclude
    });
  }

  async getAveragePriceByCategory() {
    const stats = await prisma.product.groupBy({
      by: ['categoryId'],
      where: { deletedAt: null },
      _avg: { price: true },
      _count: { id: true }
    });

    const categoryIds = stats
      .map(s => s.categoryId)
      .filter((id): id is string => id !== null);

    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true }
    });

    const categoryMap = new Map(categories.map(c => [c.id, c.name]));

    return stats.map(stat => ({
      categoryId: stat.categoryId,
      categoryName: stat.categoryId ? categoryMap.get(stat.categoryId) ?? 'Unknown' : 'Uncategorized',
      averagePrice: stat._avg.price,
      productCount: stat._count.id
    }));
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
