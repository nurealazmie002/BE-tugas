import type { Product } from '../generated/client';
import { calculateSkip, createPaginatedResponse, type PaginatedResponse } from '../utils/pagination';
import { ProductRepository } from '../repositories/product.repository';
import type { ICreateProduct, IUpdateProduct } from '../models';

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

    const whereClause: any = {
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