import type { Product, Prisma } from '../generated/client';
import { calculateSkip, createPaginatedResponse, type PaginatedResponse } from '../utils/pagination';
import { ProductRepository } from '../repositories/product.repository';
import type { ICreateProduct, IUpdateProduct } from '../models';

interface FindAllParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export class ProductService {
  constructor(private repository: ProductRepository) {}

  async getAllProducts(page: number, limit: number): Promise<PaginatedResponse<Product>> {
    const skip = calculateSkip(page, limit);

    const [products, total] = await Promise.all([
      this.repository.findAll(skip, limit),
      this.repository.count()
    ]);

    return createPaginatedResponse(products, page, limit, total);
  }

  async getAllProductsAdvanced(params: FindAllParams): Promise<PaginatedResponse<Product>> {
    const { page, limit, search, sortBy, sortOrder, categoryId, minPrice, maxPrice } = params;
    const skip = calculateSkip(page, limit);

    const whereClause: Prisma.ProductWhereInput = {
      deletedAt: null,
    };

    if (search) {
      whereClause.name = { contains: search, mode: 'insensitive' };
    }

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.price = {};
      if (minPrice !== undefined) {
        whereClause.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        whereClause.price.lte = maxPrice;
      }
    }

    const sortCriteria: Prisma.ProductOrderByWithRelationInput = sortBy 
      ? { [sortBy]: sortOrder || 'desc' } as Prisma.ProductOrderByWithRelationInput
      : { createdAt: 'desc' };

    const [products, totalItems] = await Promise.all([
      this.repository.findAllAdvanced(skip, limit, whereClause, sortCriteria),
      this.repository.countAll(whereClause)
    ]);

    return {
      data: products,
      meta: {
        page,
        limit,
        total: totalItems,
        totalPages: Math.ceil(totalItems / limit),
        hasNextPage: page < Math.ceil(totalItems / limit),
        hasPrevPage: page > 1
      }
    };
  }

  async getProductStats(categoryId?: string) {
    const stats = await this.repository.getStatistics(categoryId);
    const categoryStats = await this.repository.getProductsByCategoryStats(categoryId);
    
    return {
      overview: stats,
      byCategory: categoryStats
    };
  }

  async findComplexProducts(categoryName: string, maxPrice: number): Promise<Product[]> {
    return this.repository.findComplex(categoryName, maxPrice);
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.repository.findById(id);

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async createProduct(data: ICreateProduct): Promise<Product> {
    return this.repository.create({
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      stock: data.stock,
      categoryId: data.categoryId,
      storeId: data.storeId,
      image: data.image ?? null
    });
  }

  async updateProduct(id: string, data: IUpdateProduct): Promise<Product> {
    await this.getProductById(id);

    return this.repository.update(id, {
      ...data,
      ...(data.image !== undefined && { image: data.image })
    });
  }

  async deleteProduct(id: string): Promise<Product> {
    await this.getProductById(id);

    return this.repository.softDelete(id);
  }

  async searchProducts(
    name?: string, 
    maxPrice?: number,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Product>> {
    const skip = calculateSkip(page, limit);

    const whereClause: Prisma.ProductWhereInput = {
      deletedAt: null
    };

    if (name) {
      whereClause.name = {
        contains: name,
        mode: 'insensitive'
      };
    }

    if (maxPrice) {
      whereClause.price = {
        lte: maxPrice
      };
    }

    const [products, total] = await Promise.all([
      this.repository.search(whereClause, skip, limit),
      this.repository.count(whereClause)
    ]);

    return createPaginatedResponse(products, page, limit, total);
  }

  async restoreProduct(id: string): Promise<Product> {
    const checkProduct = await this.repository.findDeletedById(id);

    if (!checkProduct) {
      throw new Error('Product not found in trash bin');
    }

    return this.repository.restore(id);
  }
}

export class getProductDashboardService {
  constructor(private productRepo: ProductRepository) {}

  async execute() {
    const [dashboardStats, lowStockProducts, averagePriceByCategory] = await Promise.all([
      this.productRepo.getDashboardStats(),
      this.productRepo.getLowStockProducts(10, 5),
      this.productRepo.getAveragePriceByCategory()
    ]);

    return {
      totalProducts: dashboardStats._count.id,
      totalStock: dashboardStats._sum.stock ?? 0,
      lowStockProducts: lowStockProducts,
      averagePriceByCategory: averagePriceByCategory
    };
  }
}