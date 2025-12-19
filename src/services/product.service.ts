import prisma from '../prisma';
import type { Product } from '../generated/client';

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

export const getAllProducts = async (): Promise<Product[]> => {
  return await prisma.product.findMany({
    where: {
      deletedAt: null, 
    },
    include: {
      category: true, 
      store: true,    
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const getProductById = async (id: string): Promise<Product> => {
  const product = await prisma.product.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      category: true,
      store: true,
    },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
};

export const createProduct = async (data: CreateProductInput): Promise<Product> => {
  return await prisma.product.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      stock: data.stock,
      categoryId: data.categoryId,
      storeId: data.storeId,
      image: data.image ?? null, 
    },
  });
};

export const updateProduct = async (id: string, data: UpdateProductInput): Promise<Product> => {
  await getProductById(id);

  return await prisma.product.update({
    where: { id },
    data: {
      ...data,
      // Jika image di-pass sebagai undefined, jangan update field image
      ...(data.image !== undefined && { image: data.image }),
    },
  });
};

export const deleteProduct = async (id: string): Promise<Product> => {
  await getProductById(id);

  return await prisma.product.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
};

export const searchProducts = async (name?: string, maxPrice?: number): Promise<Product[]> => {
  const whereClause: any = {
    deletedAt: null,
  };

  if (name) {
    whereClause.name = {
      contains: name,
      mode: 'insensitive', 
    };
  }

  if (maxPrice) {
    whereClause.price = {
      lte: maxPrice, 
    };
  }

  return await prisma.product.findMany({
    where: whereClause,
    include: {
      category: true,
      store: true,
    },
  });
};

export const restoreProduct = async (id: string): Promise<Product> => {
  const checkProduct = await prisma.product.findFirst({
    where: {
      id,
      NOT: { deletedAt: null },
    },
  });

  if (!checkProduct) {
    throw new Error('Product not found in trash bin (Id incorrect or product is active)');
  }

  return await prisma.product.update({
    where: { id },
    data: {
      deletedAt: null,
    },
  });
};