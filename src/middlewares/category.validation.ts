import { body, param } from 'express-validator';

export const createCategoryValidation = [
  body('nama')
    .trim()
    .notEmpty().withMessage('Nama kategori wajib diisi')
    .isLength({ min: 3 }).withMessage('Nama kategori minimal 3 karakter')
];

export const getCategoryByIdValidation = [
  param('id')
    .isNumeric().withMessage('ID harus angka')
];