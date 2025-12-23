import type { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { successResponse } from '../utils/response';
import { parsePaginationParams } from '../utils/pagination';

export class ProductController {
  constructor(private productService: ProductService) {}

  getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = parsePaginationParams(req.query);
      
      const result = await this.productService.getAllProducts(page, limit);
      
      return res.json({
        success: true,
        message: 'Daftar produk',
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  searchProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, maxPrice } = req.query;
      const { page: validPage, limit: validLimit } = parsePaginationParams(req.query);
      
      const result = await this.productService.searchProducts(
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
    } catch (error) {
      next(error);
    }
  }

  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id!; 
      
      const product = await this.productService.getProductById(id);
      return successResponse(res, 'Produk ditemukan', product);
    } catch (error) {
      next(error);
    }
  }

  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

      const product = await this.productService.createProduct({
        ...req.body,
        image: imagePath, 
      });
      
      return successResponse(res, 'Produk berhasil ditambahkan', product, 201);
    } catch (error) {
      next(error);
    }
  }

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id!;
      
      const updateData = { ...req.body };
      if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`; 
      }
      
      const product = await this.productService.updateProduct(id, updateData);
      return successResponse(res, 'Produk berhasil diupdate', product);
    } catch (error) {
      next(error);
    }
  }

  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id!;
      
      const product = await this.productService.deleteProduct(id);
      return successResponse(res, 'Produk berhasil dihapus', product);
    } catch (error) {
      next(error);
    }
  }

  restoreProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id!;
      const product = await this.productService.restoreProduct(id);
      return successResponse(res, 'Produk berhasil dipulihkan', product);
    } catch (error) {
      next(error);
    }
  }
}
