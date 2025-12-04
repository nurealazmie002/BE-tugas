import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { asyncHandler } from '../utils/async.handler';
import { successResponse } from '../utils/response';

export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  const { products, total } = ProductService.getAll(page, limit);
  
  return successResponse(res, 'Daftar produk', products, { page, limit, total });
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const product = ProductService.getById(id);
  return successResponse(res, 'Produk ditemukan', product);
});

export const getProductsByCategory = asyncHandler(async (req: Request, res: Response) => {
  const { kategori } = req.query;
  
  if (!kategori) {
    throw new Error("Parameter 'kategori' wajib disertakan");
  }
  
  const result = ProductService.getByCategory(kategori as string);
  
  return successResponse(res, `Produk kategori '${kategori}'`, {
    jumlah: result.length,
    products: result
  });
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = ProductService.create(req.body);
  return successResponse(res, 'Produk berhasil ditambahkan', product, null, 201);
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const product = ProductService.update(id, req.body);
  return successResponse(res, 'Produk berhasil diupdate', product);
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const product = ProductService.delete(id);
  return successResponse(res, 'Produk berhasil dihapus', product);
});

export const searchProducts = asyncHandler(async (req: Request, res: Response) => {
  const { name, max_price } = req.query;
  const products = ProductService.search(
    name as string, 
    max_price ? Number(max_price) : undefined
  );
  
  return successResponse(res, 'Hasil pencarian', {
    jumlah: products.length,
    products
  });
});

export const searchProductsByName = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.query;
  let result = name ? ProductService.searchByName(name as string) : ProductService.getAll(1, 1000).products;
  
  return successResponse(res, 'Hasil pencarian', {
    jumlah: result.length,
    products: result
  });
});