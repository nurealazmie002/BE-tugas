import prisma from '../prisma';
import type { Store } from '../generated/client'; 

export const getAllStores = async (): Promise<Store[]> => {
  return await prisma.store.findMany({
    include: {
      products: {
        include: {
          category: true
        }
      }
    }
  });
};

export const getStoreById = async (id: string): Promise<Store> => {
  const store = await prisma.store.findUnique({
    where: { id },
    include: {
      products: {
        include: {
          category: true
        }
      }
    }
  });
  
  if (!store) {
    throw new Error('Store not found');
  }
  
  return store;
};

export const createStore = async (data: { 
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
  isActive?: boolean;
}): Promise<Store> => {
  return await prisma.store.create({
    data: {
      name: data.name,
      address: data.address ?? null,
      phone: data.phone ?? null,
      email: data.email ?? null,
      description: data.description ?? null,
      isActive: data.isActive ?? true
    },
  });
};

export const updateStore = async (id: string, data: Partial<Store>): Promise<Store> => {
  await getStoreById(id); 

  return await prisma.store.update({
    where: { id },
    data,
  });
};

export const deleteStore = async (id: string): Promise<Store> => {
  await getStoreById(id); 

  return await prisma.store.delete({
    where: { id },
  });
};

export const searchStores = async (name?: string, isActive?: boolean): Promise<Store[]> => {
  return await prisma.store.findMany({
    where: {
      ...(name && {
        name: {
          contains: name,
          mode: 'insensitive' 
        }
      }),
      ...(isActive !== undefined && { isActive })
    },
    include: {
      products: true
    }
  });
};

export const getStoreProducts = async (storeId: string) => {
  await getStoreById(storeId); 
  
  return await prisma.product.findMany({
    where: { storeId }, 
    include: {
      category: true
    }
  });
};