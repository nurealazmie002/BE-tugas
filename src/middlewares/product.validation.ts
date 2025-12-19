import { body, param } from 'express-validator';

export const createProductValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nama produk wajib diisi')
    .isLength({ min: 4 }).withMessage('Nama produk minimal 4 karakter'),
  
  body('description')
    .trim()
    .optional()
    .isLength({ min: 10 }).withMessage('Deskripsi minimal 10 karakter jika diisi'),
  
  body('price')
    .notEmpty().withMessage('Harga wajib diisi')
    .isNumeric().withMessage('Harga harus angka')
    .custom((value: number) => value > 0).withMessage('Harga harus lebih dari 0'),
  
  body('stock')
    .notEmpty().withMessage('Stok wajib diisi')
    .isNumeric().withMessage('Stok harus angka')
    .custom((value: number) => value >= 0).withMessage('Stok tidak boleh negatif'),
  
  body('categoryId')
    .notEmpty().withMessage('Category ID wajib diisi')
    .isUUID().withMessage('Category ID harus UUID yang valid'),
  
  body('storeId')
    .notEmpty().withMessage('Store ID wajib diisi')
    .isUUID().withMessage('Store ID harus UUID yang valid'),
  
];

export const getProductByIdValidation = [
  param('id')
    .isUUID().withMessage('ID harus UUID yang valid') 
];