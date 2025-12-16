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

const router = Router();

router.get('/products', getAllProducts);
router.get('/products/search', searchProducts); 
router.get('/products/:id', validate(getProductByIdValidation), getProductById);
router.post('/products', validate(createProductValidation), createProduct);
router.put('/products/:id', validate(createProductValidation), updateProduct); 
router.delete('/products/:id', validate(getProductByIdValidation), deleteProduct);
router.patch('/products/:id/restore', validate(getProductByIdValidation), restoreProduct);

export default router;