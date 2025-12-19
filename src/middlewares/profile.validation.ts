import { body, param } from 'express-validator';

export const createProfileValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nama lengkap wajib diisi')
    .isLength({ min: 3 }).withMessage('Nama minimal 3 karakter')
    .isLength({ max: 100 }).withMessage('Nama maksimal 100 karakter'),
  
  body('gender')
    .optional()
    .trim()
    .isIn(['male', 'female', 'other']).withMessage('Gender harus: male, female, atau other'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Alamat maksimal 500 karakter'),
];

export const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3 }).withMessage('Nama minimal 3 karakter')
    .isLength({ max: 100 }).withMessage('Nama maksimal 100 karakter'),
  
  body('gender')
    .optional()
    .trim()
    .isIn(['male', 'female', 'other']).withMessage('Gender harus: male, female, atau other'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Alamat maksimal 500 karakter'),
];

export const getUserIdParamValidation = [
  param('userId')
    .isUUID().withMessage('User ID harus UUID yang valid')
];