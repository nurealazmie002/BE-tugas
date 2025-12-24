import type { Request, Response, NextFunction } from 'express';
import { ProductService, getProductDashboardService } from '../services/product.service';
import { successResponse } from '../utils/response';
import { parsePaginationParams } from '../utils/pagination';

export class ProductController {
  constructor(
    private productService: ProductService,
    private dashboardService?: getProductDashboardService
  ) {}

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

  getAllProductsAdvanced = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = parsePaginationParams(req.query);
      const { search, sortBy, sortOrder, categoryId, minPrice, maxPrice } = req.query;
      
      const params: {
        page: number;
        limit: number;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
        categoryId?: string;
        minPrice?: number;
        maxPrice?: number;
      } = { page, limit };

      if (search) params.search = search as string;
      if (sortBy) params.sortBy = sortBy as string;
      if (sortOrder) params.sortOrder = sortOrder as 'asc' | 'desc';
      if (categoryId) params.categoryId = categoryId as string;
      if (minPrice) params.minPrice = Number(minPrice);
      if (maxPrice) params.maxPrice = Number(maxPrice);

      const result = await this.productService.getAllProductsAdvanced(params);
      
      return res.json({
        success: true,
        message: 'Daftar produk (advanced)',
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId = req.query.categoryId as string | undefined;
      
      const stats = await this.productService.getProductStats(categoryId);
      
      return successResponse(res, 'Statistik produk berhasil diambil', stats);
    } catch (error) {
      next(error);
    }
  }

  getDashboard = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      if (!this.dashboardService) {
        return res.status(500).json({
          success: false,
          message: 'Dashboard service not initialized'
        });
      }

      const dashboard = await this.dashboardService.execute();
      
      return successResponse(res, 'Dashboard statistik produk berhasil diambil', dashboard);
    } catch (error) {
      next(error);
    }
  }

  findComplexProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryName = req.query.categoryName as string;
      const maxPrice = Number(req.query.maxPrice);

      if (!categoryName || !maxPrice) {
        return res.status(400).json({
          success: false,
          message: 'categoryName dan maxPrice harus diisi'
        });
      }
      
      const products = await this.productService.findComplexProducts(categoryName, maxPrice);
      
      return successResponse(res, 'Produk dengan filter kompleks', products);
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
