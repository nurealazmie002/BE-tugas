import type { Request, Response } from 'express';
import * as ProductService from '../services/product.service';
import { asyncHandler } from '../utils/async.handler';
import { successResponse } from '../utils/response';

export const getAllProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await ProductService.getAllProducts();
  return successResponse(res, 'Daftar produk', products);
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

export const searchProducts = asyncHandler(async (req: Request, res: Response) => {
  const { name, maxPrice } = req.query;
  
  const products = await ProductService.searchProducts(
    name as string,
    maxPrice ? Number(maxPrice) : undefined
  );
  return successResponse(res, 'Hasil pencarian', products);
});