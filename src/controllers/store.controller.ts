import type { Request, Response } from 'express';
import * as StoreService from '../services/store.service';
import { asyncHandler } from '../utils/async.handler';

// 1. FIX: Ganti 'req' jadi '_req' kalau tidak dipakai, agar tidak kena warning linter
export const getAllStores = asyncHandler(async (_req: Request, res: Response) => {
  const stores = await StoreService.getAllStores();
  res.json({ success: true, data: stores });
});

export const getStoreById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // 2. FIX: Cek jika ID tidak ada (Type Guard)
  // Ini membuat TypeScript yakin bahwa setelah baris ini, 'id' pasti string
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
  // Pastikan route ini diproteksi middleware authenticate agar req.user ada
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

  // 3. FIX: Type Guard lagi
  if (!id) {
    return res.status(400).json({ success: false, message: 'ID param is required' });
  }

  const store = await StoreService.updateStore(id, req.body);
  res.json({ success: true, message: 'Toko berhasil diupdate', data: store });
});

export const deleteStore = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // 4. FIX: Type Guard lagi
  if (!id) {
    return res.status(400).json({ success: false, message: 'ID param is required' });
  }

  await StoreService.deleteStore(id);
  res.json({ success: true, message: 'Toko berhasil dihapus' });
});

export const searchStores = asyncHandler(async (req: Request, res: Response) => {
    const keyword = (req.query.q as string) || ''; 
    const stores = await StoreService.searchStores(keyword);
    res.json({ success: true, data: stores });
});

export const getStoreProducts = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ success: false, message: 'ID param is required' });
    }
    const products = await StoreService.getStoreProducts(id);
    res.json({ success: true, data: products });
});