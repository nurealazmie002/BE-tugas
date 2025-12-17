import prisma from '../prisma';

interface CreateStoreInput {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
}

export const getAllStores = async () => {
  return await prisma.store.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });
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

export const searchStores = async (keyword: string) => {
  return await prisma.store.findMany({
    where: {
      OR: [
        { name: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
        { address: { contains: keyword, mode: 'insensitive' } },
      ],
    },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });
};

export const getStoreProducts = async (storeId: string) => {
  const store = await getStoreById(storeId);
  return store.products;
};