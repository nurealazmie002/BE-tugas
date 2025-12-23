import type { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { successResponse } from '../utils/response';
import { parsePaginationParams } from '../utils/pagination';

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = parsePaginationParams(req.query);
      const result = await this.categoryService.getAllCategories(page, limit);
      
      return res.json({
        success: true,
        message: 'Daftar kategori',
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id!; 
      
      const category = await this.categoryService.getCategoryById(id);
      return successResponse(res, 'Kategori ditemukan', category);
    } catch (error) {
      next(error);
    }
  }

  createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.categoryService.createCategory(req.body);
      return successResponse(res, 'Kategori berhasil dibuat', category, 201);
    } catch (error) {
      next(error);
    }
  }

  updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id!;
      
      const category = await this.categoryService.updateCategory(id, req.body);
      return successResponse(res, 'Kategori berhasil diupdate', category);
    } catch (error) {
      next(error);
    }
  }

  deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id!;
      
      const category = await this.categoryService.deleteCategory(id);
      return successResponse(res, 'Kategori berhasil dihapus', category);
    } catch (error) {
      next(error);
    }
  }

  searchCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.query;
      const categories = await this.categoryService.searchCategories(name as string);
      return successResponse(res, 'Hasil pencarian', categories);
    } catch (error) {
      next(error);
    }
  }
}