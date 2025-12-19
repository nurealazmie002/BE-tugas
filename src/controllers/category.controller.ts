import type { Request, Response } from 'express';
import * as CategoryService from '../services/category.service';
import { asyncHandler } from '../utils/async.handler';
import { successResponse } from '../utils/response';
import { parsePaginationParams } from '../utils/pagination';

export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePaginationParams(req.query);
  const result = await CategoryService.getAllCategories(page, limit);
  
  return res.json({
    success: true,
    message: 'Daftar kategori',
    data: result.data,
    meta: result.meta,
  });
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id!; 
    
    const category = await CategoryService.getCategoryById(id);
    return successResponse(res, 'Kategori ditemukan', category);
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await CategoryService.createCategory(req.body);
    return successResponse(res, 'Kategori berhasil dibuat', category, 201);
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id!;
    
    const category = await CategoryService.updateCategory(id, req.body);
    return successResponse(res, 'Kategori berhasil diupdate', category);
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id!;
    
    const category = await CategoryService.deleteCategory(id);
    return successResponse(res, 'Kategori berhasil dihapus', category);
});

export const searchCategories = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.query;
    const categories = await CategoryService.searchCategories(name as string);
    return successResponse(res, 'Hasil pencarian', categories);
});