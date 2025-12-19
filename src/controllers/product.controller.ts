import type { Request, Response } from 'express';
import * as ProductService from '../services/product.service';
import { asyncHandler } from '../utils/async.handler';
import { successResponse } from '../utils/response';
import { parsePaginationParams } from '../utils/pagination';

export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePaginationParams(req.query);
  
  const result = await ProductService.getAllProducts(page, limit);
  
  return res.json({
    success: true,
    message: 'Daftar produk',
    data: result.data,
    meta: result.meta,
  });
});

export const searchProducts = asyncHandler(async (req: Request, res: Response) => {
  const { name, maxPrice } = req.query;
  const { page: validPage, limit: validLimit } = parsePaginationParams(req.query);
  
  const result = await ProductService.searchProducts(
    name as string,
    maxPrice ? Number(maxPrice) : undefined,
    validPage,
    validLimit
  );
  
  return res.json({
    success: true,
    message: 'Hasil pencarian',
    data: result.data,
    meta: result.meta,
  });
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id!; 
  
  const product = await ProductService.getProductById(id);
  return successResponse(res, 'Produk ditemukan', product);
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const product = await ProductService.createProduct({
    ...req.body,
    image: imagePath, 
  });
  
  return successResponse(res, 'Produk berhasil ditambahkan', product, 201);
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id!;
  
  const updateData = { ...req.body };
  if (req.file) {
    updateData.image = `/uploads/${req.file.filename}`; 
  }
  
  const product = await ProductService.updateProduct(id, updateData);
  return successResponse(res, 'Produk berhasil diupdate', product);
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id!;
  
  const product = await ProductService.deleteProduct(id);
  return successResponse(res, 'Produk berhasil dihapus', product);
});

export const restoreProduct = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id!;
    const product = await ProductService.restoreProduct(id);
    return successResponse(res, 'Produk berhasil dipulihkan', product);
});

