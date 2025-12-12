import type { Request, Response } from 'express';
import * as StoreService from '../services/store.service';
import { asyncHandler } from '../utils/async.handler';
import { successResponse } from '../utils/response';

export const getAllStores = asyncHandler(async (_req: Request, res: Response) => {
  const stores = await StoreService.getAllStores();
  return successResponse(res, 'Daftar toko', stores);
});

export const getStoreById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id!);
  const store = await StoreService.getStoreById(id);
  return successResponse(res, 'Toko ditemukan', store);
});

export const createStore = asyncHandler(async (req: Request, res: Response) => {
  const store = await StoreService.createStore(req.body);
  return successResponse(res, 'Toko berhasil ditambahkan', store, null, 201);
});

export const updateStore = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id!);
  const store = await StoreService.updateStore(id, req.body);
  return successResponse(res, 'Toko berhasil diupdate', store);
});

export const deleteStore = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id!);
  const store = await StoreService.deleteStore(id);
  return successResponse(res, 'Toko berhasil dihapus', store);
});

export const searchStores = asyncHandler(async (req: Request, res: Response) => {
  const { name, is_active } = req.query;
  const stores = await StoreService.searchStores(
    name as string,
    is_active ? is_active === 'true' : undefined
  );
  return successResponse(res, 'Hasil pencarian', stores);
});

export const getStoreProducts = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id!);
  const products = await StoreService.getStoreProducts(id);
  return successResponse(res, 'Produk dari toko', products);
});