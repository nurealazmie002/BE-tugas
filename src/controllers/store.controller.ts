import type { Request, Response, NextFunction } from 'express';
import { StoreService } from '../services/store.service';
import { parsePaginationParams } from '../utils/pagination';

export class StoreController {
  constructor(private storeService: StoreService) {}

  getAllStores = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = parsePaginationParams(req.query);
      const result = await this.storeService.getAllStores(page, limit);
      
      return res.json({
        success: true,
        message: 'Daftar stores',
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  getStoreById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ success: false, message: 'ID param is required' });
      }

      const store = await this.storeService.getStoreById(id);
      
      if (!store) {
        return res.status(404).json({ success: false, message: 'Toko tidak ditemukan' });
      }

      res.json({ success: true, data: store });
    } catch (error) {
      next(error);
    }
  }

  createStore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const store = await this.storeService.createStore(userId, req.body);

      res.status(201).json({
        success: true,
        message: 'Toko berhasil dibuat',
        data: store,
      });
    } catch (error) {
      next(error);
    }
  }

  updateStore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ success: false, message: 'ID param is required' });
      }

      const store = await this.storeService.updateStore(id, req.body);
      res.json({ success: true, message: 'Toko berhasil diupdate', data: store });
    } catch (error) {
      next(error);
    }
  }

  deleteStore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ success: false, message: 'ID param is required' });
      }

      await this.storeService.deleteStore(id);
      res.json({ success: true, message: 'Toko berhasil dihapus' });
    } catch (error) {
      next(error);
    }
  }

  searchStores = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const keyword = (req.query.q as string) || '';
      const { page, limit } = parsePaginationParams(req.query);
      
      const result = await this.storeService.searchStores(keyword, page, limit);
      
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

  getStoreProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ success: false, message: 'ID param is required' });
      }
      const products = await this.storeService.getStoreProducts(id);
      res.json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  }
}