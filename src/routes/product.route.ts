import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  searchProductsByName,
  getProductsByCategory
} from '../controllers/product.controller';
import { 
  validate, 
  createProductValidation, 
  getProductByIdValidation,
  getProductsQueryValidation
} from '../middlewares/product.validation';

const router = Router();

router.get('/search', searchProducts);
router.get('/searchname', searchProductsByName);
router.get('/categories', getProductsByCategory);

router.get('/', validate(getProductsQueryValidation), getAllProducts);
router.get('/:id', validate(getProductByIdValidation), getProductById);
router.post('/', validate(createProductValidation), createProduct);
router.put('/:id', validate(createProductValidation), updateProduct);
router.delete('/:id', validate(getProductByIdValidation), deleteProduct);

export default router;