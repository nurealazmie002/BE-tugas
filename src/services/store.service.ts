import { calculateSkip, createPaginatedResponse } from '../utils/pagination';
import * as StoreRepository from '../repositories/store.repository';

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
    StoreRepository.findAll(skip, limit),
    StoreRepository.count()
  ]);

  return createPaginatedResponse(stores, page, limit, total);
};

export const createStore = async (userId: string, data: CreateStoreInput) => {
  return StoreRepository.create({
    ...data,
    userId
  });
};

export const getStoreById = async (id: string) => {
  const store = await StoreRepository.findByIdWithProducts(id);
  
  if (!store) throw new Error('Store tidak ditemukan');
  return store;
};

export const updateStore = async (id: string, data: Partial<CreateStoreInput>) => {
  await getStoreById(id);
  return StoreRepository.update(id, data);
};

export const deleteStore = async (id: string) => {
  await getStoreById(id);
  return StoreRepository.remove(id);
};

export const searchStores = async (keyword: string, page: number, limit: number) => {
  const skip = calculateSkip(page, limit);

  const [stores, total] = await Promise.all([
    StoreRepository.search(keyword, skip, limit),
    StoreRepository.searchCount(keyword)
  ]);

  return createPaginatedResponse(stores, page, limit, total);
};

export const getStoreProducts = async (storeId: string) => {
  const store = await StoreRepository.findByIdWithProducts(storeId);
  if (!store) throw new Error('Store tidak ditemukan');
  return store.products;
};