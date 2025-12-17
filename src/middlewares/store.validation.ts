import { body, param, query } from 'express-validator';

export const createStoreValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nama toko wajib diisi')
    .isLength({ min: 3 }).withMessage('Nama toko minimal 3 karakter')
    .isLength({ max: 100 }).withMessage('Nama toko maksimal 100 karakter'),
  
  body('address')
    .trim()
    .optional()
    .isLength({ min: 10 }).withMessage('Alamat minimal 10 karakter jika diisi')
    .isLength({ max: 255 }).withMessage('Alamat maksimal 255 karakter'),
  
  body('phone')
    .trim()
    .optional()
    .matches(/^(\+62|62|0)[0-9]{9,12}$/).withMessage('Format nomor telepon tidak valid (contoh: 081234567890)'),
  
  body('email')
    .trim()
    .optional()
    .isEmail().withMessage('Format email tidak valid')
    .normalizeEmail(),
  
  body('description')
    .trim()
    .optional()
    .isLength({ min: 10 }).withMessage('Deskripsi minimal 10 karakter jika diisi')
    .isLength({ max: 500 }).withMessage('Deskripsi maksimal 500 karakter'),
  
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive harus boolean (true/false)')
];

export const updateStoreValidation = [
  param('id')
    .isUUID().withMessage('ID harus berupa UUID yang valid'),
  
  body('name')
    .trim()
    .optional()
    .isLength({ min: 3 }).withMessage('Nama toko minimal 3 karakter')
    .isLength({ max: 100 }).withMessage('Nama toko maksimal 100 karakter'),
  
  body('address')
    .trim()
    .optional()
    .isLength({ min: 10 }).withMessage('Alamat minimal 10 karakter')
    .isLength({ max: 255 }).withMessage('Alamat maksimal 255 karakter'),
  
  body('phone')
    .trim()
    .optional()
    .matches(/^(\+62|62|0)[0-9]{9,12}$/).withMessage('Format nomor telepon tidak valid'),
  
  body('email')
    .trim()
    .optional()
    .isEmail().withMessage('Format email tidak valid')
    .normalizeEmail(),
  
  body('description')
    .trim()
    .optional()
    .isLength({ min: 10 }).withMessage('Deskripsi minimal 10 karakter')
    .isLength({ max: 500 }).withMessage('Deskripsi maksimal 500 karakter'),
  
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive harus boolean (true/false)')
];

export const getStoreByIdValidation = [
  param('id')
    .isUUID().withMessage('ID harus berupa UUID yang valid')
];

export const deleteStoreValidation = [
  param('id')
    .isUUID().withMessage('ID harus berupa UUID yang valid')
];

export const searchStoresValidation = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1 }).withMessage('Keyword pencarian minimal 1 karakter'),
  
  query('is_active')
    .optional()
    .isIn(['true', 'false']).withMessage('is_active harus true atau false')
];