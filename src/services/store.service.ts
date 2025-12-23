import { calculateSkip, createPaginatedResponse } from '../utils/pagination';
import { StoreRepository } from '../repositories/store.repository';
import type { ICreateStore, IUpdateStore } from '../models';

export class StoreService {
  constructor(private repository: StoreRepository) {}

  async getAllStores(page: number, limit: number) {
    const skip = calculateSkip(page, limit);

    const [stores, total] = await Promise.all([
      this.repository.findAll(skip, limit),
      this.repository.count()
    ]);

    return createPaginatedResponse(stores, page, limit, total);
  }

  async createStore(userId: string, data: Omit<ICreateStore, 'userId'>) {
    return this.repository.create({
      ...data,
      userId
    });
  }

  async getStoreById(id: string) {
    const store = await this.repository.findByIdWithProducts(id);
    
    if (!store) throw new Error('Store tidak ditemukan');
    return store;
  }

  async updateStore(id: string, data: IUpdateStore) {
    await this.getStoreById(id);
    return this.repository.update(id, data);
  }

  async deleteStore(id: string) {
    await this.getStoreById(id);
    return this.repository.remove(id);
  }

  async searchStores(keyword: string, page: number, limit: number) {
    const skip = calculateSkip(page, limit);

    const [stores, total] = await Promise.all([
      this.repository.search(keyword, skip, limit),
      this.repository.searchCount(keyword)
    ]);

    return createPaginatedResponse(stores, page, limit, total);
  }

  async getStoreProducts(storeId: string) {
    const store = await this.repository.findByIdWithProducts(storeId);
    if (!store) throw new Error('Store tidak ditemukan');
    return store.products;
  }
}