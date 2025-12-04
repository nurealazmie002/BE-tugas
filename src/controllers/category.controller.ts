import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { asyncHandler } from '../utils/async.handler';
import { successResponse } from '../utils/response';

export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = CategoryService.getAll();
  return successResponse(res, 'Daftar kategori', categories);
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const category = CategoryService.getById(id);
  return successResponse(res, 'Kategori ditemukan', category);
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = CategoryService.create(req.body);
  return successResponse(res, 'Kategori berhasil ditambahkan', category, null, 201);
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const category = CategoryService.delete(id);
  return successResponse(res, 'Kategori berhasil dihapus', category);
});