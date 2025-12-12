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
    .isNumeric().withMessage('ID harus angka'),
  
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
    .isNumeric().withMessage('ID harus angka')
];

export const deleteStoreValidation = [
  param('id')
    .isNumeric().withMessage('ID harus angka')
];

export const searchStoresValidation = [
  query('name')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Keyword pencarian minimal 2 karakter'),
  
  query('is_active')
    .optional()
    .isIn(['true', 'false']).withMessage('is_active harus true atau false')
];