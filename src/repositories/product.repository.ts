import prisma from '../prisma';
import type { Product, Prisma } from '../generated/client';

const productInclude = {
  category: true,
  store: true
};

export const findAll = async (skip: number, take: number): Promise<Product[]> => {
  return prisma.product.findMany({
    skip,
    take,
    where: {
      deletedAt: null
    },
    include: productInclude,
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const count = async (where?: Prisma.ProductWhereInput): Promise<number> => {
  return prisma.product.count({
    where: where ?? { deletedAt: null }
  });
};

export const findById = async (id: string): Promise<Product | null> => {
  return prisma.product.findFirst({
    where: {
      id,
      deletedAt: null
    },
    include: productInclude
  });
};

export const create = async (data: {
  name: string;
  price: number;
  stock: number;
  description?: string | null;
  categoryId: string;
  storeId: string;
  image?: string | null;
}): Promise<Product> => {
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
};

export const update = async (id: string, data: Prisma.ProductUpdateInput): Promise<Product> => {
  return prisma.product.update({
    where: { id },
    data
  });
};

export const softDelete = async (id: string): Promise<Product> => {
  return prisma.product.update({
    where: { id },
    data: {
      deletedAt: new Date()
    }
  });
};

export const restore = async (id: string): Promise<Product> => {
  return prisma.product.update({
    where: { id },
    data: {
      deletedAt: null
    }
  });
};

export const findDeletedById = async (id: string): Promise<Product | null> => {
  return prisma.product.findFirst({
    where: {
      id,
      NOT: { deletedAt: null }
    }
  });
};

export const search = async (
  where: Prisma.ProductWhereInput,
  skip: number,
  take: number
): Promise<Product[]> => {
  return prisma.product.findMany({
    skip,
    take,
    where,
    include: productInclude
  });
};
