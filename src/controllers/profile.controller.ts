import type { Request, Response, NextFunction } from 'express';
import { ProfileService } from '../services/profile.service';
import { successResponse } from '../utils/response';
import { parsePaginationParams } from '../utils/pagination';

export class ProfileController {
  constructor(private profileService: ProfileService) {}

  getAllProfiles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = parsePaginationParams(req.query);
      const result = await this.profileService.getAllProfiles(page, limit);
      return res.json({
        success: true,
        message: 'Daftar semua profile',
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  getProfileByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID wajib diisi'
        });
      }
      
      const profile = await this.profileService.getProfileByUserId(userId);
      
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Profile tidak ditemukan'
        });
      }
      
      return successResponse(res, 'Profile ditemukan', profile);
    } catch (error) {
      next(error);
    }
  }

  getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      
      const profile = await this.profileService.getProfileByUserId(userId);
      
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Profile belum dibuat. Silakan buat profile terlebih dahulu.'
        });
      }
      
      return successResponse(res, 'Profile ditemukan', profile);
    } catch (error) {
      next(error);
    }
  }

  createProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      
      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
      
      const profile = await this.profileService.createProfile({
        ...req.body,
        image: imagePath,
        userId,
      });
      
      return successResponse(res, 'Profile berhasil dibuat', profile, 201);
    } catch (error) {
      next(error);
    }
  }

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      
      const updateData = { ...req.body };
      if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`;
      }
      
      const profile = await this.profileService.updateProfile(userId, updateData);
      
      return successResponse(res, 'Profile berhasil diupdate', profile);
    } catch (error) {
      next(error);
    }
  }

  deleteProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      
      await this.profileService.deleteProfile(userId);
      
      return successResponse(res, 'Profile berhasil dihapus', null);
    } catch (error) {
      next(error);
    }
  }
}