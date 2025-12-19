import type { Request, Response } from 'express';
import * as StoreService from '../services/store.service';
import { asyncHandler } from '../utils/async.handler';
import { parsePaginationParams } from '../utils/pagination';

export const getAllStores = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePaginationParams(req.query);
  const result = await StoreService.getAllStores(page, limit);
  
  return res.json({
    success: true,
    message: 'Daftar stores',
    data: result.data,
    meta: result.meta,
  });
});

export const getStoreById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: 'ID param is required' });
  }

  const store = await StoreService.getStoreById(id);
  
  if (!store) {
    return res.status(404).json({ success: false, message: 'Toko tidak ditemukan' });
  }

  res.json({ success: true, data: store });
});

export const createStore = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  
  if (!userId) {
     return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const store = await StoreService.createStore(userId, req.body);

  res.status(201).json({
    success: true,
    message: 'Toko berhasil dibuat',
    data: store,
  });
});

export const updateStore = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: 'ID param is required' });
  }

  const store = await StoreService.updateStore(id, req.body);
  res.json({ success: true, message: 'Toko berhasil diupdate', data: store });
});

export const deleteStore = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: 'ID param is required' });
  }

  await StoreService.deleteStore(id);
  res.json({ success: true, message: 'Toko berhasil dihapus' });
});

export const searchStores = asyncHandler(async (req: Request, res: Response) => {
  const keyword = (req.query.q as string) || '';
  const { page, limit } = parsePaginationParams(req.query);
  
  const result = await StoreService.searchStores(keyword, page, limit);
  
  return res.json({
    success: true,
    message: 'Hasil pencarian',
    data: result.data,
    meta: result.meta,
  });
});

export const getStoreProducts = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ success: false, message: 'ID param is required' });
    }
    const products = await StoreService.getStoreProducts(id);
    res.json({ success: true, data: products });
});