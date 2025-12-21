import type { Product } from '../generated/client';
import { calculateSkip, createPaginatedResponse, type PaginatedResponse } from '../utils/pagination';
import * as ProductRepository from '../repositories/product.repository';

interface CreateProductInput {
  name: string;
  price: number;
  stock: number;
  description?: string;
  categoryId: string;
  storeId: string;
  image?: string;
}

type UpdateProductInput = Partial<CreateProductInput>;

export const getAllProducts = async (page: number, limit: number): Promise<PaginatedResponse<Product>> => {
  const skip = calculateSkip(page, limit);

  const [products, total] = await Promise.all([
    ProductRepository.findAll(skip, limit),
    ProductRepository.count()
  ]);

  return createPaginatedResponse(products, page, limit, total);
};

export const getProductById = async (id: string): Promise<Product> => {
  const product = await ProductRepository.findById(id);

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
};

export const createProduct = async (data: CreateProductInput): Promise<Product> => {
  return ProductRepository.create({
    name: data.name,
    description: data.description ?? null,
    price: data.price,
    stock: data.stock,
    categoryId: data.categoryId,
    storeId: data.storeId,
    image: data.image ?? null
  });
};

export const updateProduct = async (id: string, data: UpdateProductInput): Promise<Product> => {
  await getProductById(id);

  return ProductRepository.update(id, {
    ...data,
    ...(data.image !== undefined && { image: data.image })
  });
};

export const deleteProduct = async (id: string): Promise<Product> => {
  await getProductById(id);

  return ProductRepository.softDelete(id);
};

export const searchProducts = async (
  name?: string, 
  maxPrice?: number,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Product>> => {
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
    ProductRepository.search(whereClause, skip, limit),
    ProductRepository.count(whereClause)
  ]);

  return createPaginatedResponse(products, page, limit, total);
};

export const restoreProduct = async (id: string): Promise<Product> => {
  const checkProduct = await ProductRepository.findDeletedById(id);

  if (!checkProduct) {
    throw new Error('Product not found in trash bin');
  }

  return ProductRepository.restore(id);
};