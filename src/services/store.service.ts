import prisma from '../prisma';
import { calculateSkip, createPaginatedResponse} from '../utils/pagination';

interface CreateStoreInput {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
}

export const getAllStores = async (page: number, limit: number) => {
  const skip = calculateSkip(page, limit);

  const [stores, total] = await Promise.all([
    prisma.store.findMany({
      skip,
      take: limit,
      include: {
        user: {
          select: { username: true, email: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.store.count()
  ]);

  return createPaginatedResponse(stores, page, limit, total);
};

export const createStore = async (userId: string, data: CreateStoreInput) => {
  return await prisma.store.create({
    data: {
      ...data,
      userId: userId,
    },
  });
};

export const getStoreById = async (id: string) => {
  const store = await prisma.store.findUnique({
    where: { id },
    include: {
      products: true,
    },
  });
  
  if (!store) throw new Error("Store tidak ditemukan");
  return store;
};

export const updateStore = async (id: string, data: Partial<CreateStoreInput>) => {
  await getStoreById(id);
  return await prisma.store.update({
    where: { id },
    data,
  });
};

export const deleteStore = async (id: string) => {
  await getStoreById(id);
  return await prisma.store.delete({
    where: { id },
  });
};

export const searchStores = async (keyword: string, page: number, limit: number) => {
  const skip = calculateSkip(page, limit);

  const whereClause = {
    OR: [
      { name: { contains: keyword, mode: 'insensitive' as const } },
      { description: { contains: keyword, mode: 'insensitive' as const } },
      { address: { contains: keyword, mode: 'insensitive' as const } },
    ],
  };

  const [stores, total] = await Promise.all([
    prisma.store.findMany({
      skip,
      take: limit,
      where: whereClause,
      include: {
        user: {
          select: { username: true, email: true }
        }
      }
    }),
    prisma.store.count({ where: whereClause })
  ]);

  return createPaginatedResponse(stores, page, limit, total);
};

export const getStoreProducts = async (storeId: string) => {
  const store = await getStoreById(storeId);
  return store.products;
};