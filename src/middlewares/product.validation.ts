import { body, param, query, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorList = errors.array().map((err: any) => ({
      field: err.type === 'field' ? err.path : 'unknown',
      message: err.msg
    }));

    return errorResponse(res, 'Validasi gagal', 400, errorList);
  };
};

export const createProductValidation = [
  body('nama')
    .trim()
    .notEmpty().withMessage('Nama produk wajib diisi')
    .isLength({ min: 3 }).withMessage('Nama produk minimal 3 karakter'),
  
  body('deskripsi')
    .trim()
    .notEmpty().withMessage('Deskripsi wajib diisi'),
  
  body('harga')
    .isNumeric().withMessage('Harga harus angka')
    .custom(value => value > 0).withMessage('Harga harus lebih dari 0'),
  
  body('kategori')
    .trim()
    .notEmpty().withMessage('Kategori wajib diisi'),
  
  body('stok')
    .isNumeric().withMessage('Stok harus angka')
    .custom(value => value >= 0).withMessage('Stok tidak boleh negatif')
];

export const getProductByIdValidation = [
  param('id')
    .isNumeric().withMessage('ID harus angka')
];

export const getProductsQueryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page harus angka minimal 1'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit harus angka 1-100')
];