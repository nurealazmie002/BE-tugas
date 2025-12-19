import type { Request, Response } from 'express';
import * as ProfileService from '../services/profile.service';
import { asyncHandler } from '../utils/async.handler';
import { successResponse } from '../utils/response';

// Get all profiles (admin only)
export const getAllProfiles = asyncHandler(async (_req: Request, res: Response) => {
  const profiles = await ProfileService.getAllProfiles();
  return successResponse(res, 'Daftar semua profile', profiles);
});

// Get profile by user ID
export const getProfileByUserId = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  
  // Type guard untuk memastikan userId ada
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID wajib diisi'
    });
  }
  
  const profile = await ProfileService.getProfileByUserId(userId);
  
  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Profile tidak ditemukan'
    });
  }
  
  return successResponse(res, 'Profile ditemukan', profile);
});

// Get my profile (authenticated user)
export const getMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  
  const profile = await ProfileService.getProfileByUserId(userId);
  
  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Profile belum dibuat. Silakan buat profile terlebih dahulu.'
    });
  }
  
  return successResponse(res, 'Profile ditemukan', profile);
});

// Create profile
export const createProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  
  // Ambil path gambar dari multer (jika ada)
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  
  const profile = await ProfileService.createProfile({
    ...req.body,
    image: imagePath,
    userId,
  });
  
  return successResponse(res, 'Profile berhasil dibuat', profile, 201);
});

// Update profile
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  
  // Jika ada file baru, update path-nya
  const updateData = { ...req.body };
  if (req.file) {
    updateData.image = `/uploads/${req.file.filename}`;
  }
  
  const profile = await ProfileService.updateProfile(userId, updateData);
  
  return successResponse(res, 'Profile berhasil diupdate', profile);
});

// Delete profile
export const deleteProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  
  await ProfileService.deleteProfile(userId);
  
  return successResponse(res, 'Profile berhasil dihapus', null);
});