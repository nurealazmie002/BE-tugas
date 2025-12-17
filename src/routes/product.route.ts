import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  restoreProduct 
} from '../controllers/product.controller';
import { validate } from '../utils/validate';
import { 
  createProductValidation, 
  getProductByIdValidation,
} from '../middlewares/product.validation';
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get('/products', getAllProducts);
router.get('/products/search', searchProducts); 
router.get('/products/:id', validate(getProductByIdValidation), getProductById);
router.post('/products', authenticate, validate(createProductValidation), createProduct);
router.put('/products/:id', authenticate, validate(createProductValidation), updateProduct); 
router.delete('/products/:id', authenticate, validate(getProductByIdValidation), deleteProduct);
router.patch('/products/:id/restore', authenticate, validate(getProductByIdValidation), restoreProduct);

export default router;