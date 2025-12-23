import { Router } from 'express';
import { validate } from '../utils/validate';
import { 
  createProductValidation, 
  getProductByIdValidation,
} from '../middlewares/product.validation';
import { authenticate } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware'; 

import { ProductRepository } from '../repositories/product.repository';
import { ProductService } from '../services/product.service';
import { ProductController } from '../controllers/product.controller';

const router = Router();

const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

router.get('/products', productController.getAllProducts);
router.get('/products/search', productController.searchProducts); 
router.get('/products/:id', validate(getProductByIdValidation), productController.getProductById);

router.post('/products', 
  authenticate, 
  upload.single('image'), 
  validate(createProductValidation), 
  productController.createProduct
);

router.put('/products/:id', 
  authenticate, 
  upload.single('image'), 
  validate(createProductValidation), 
  productController.updateProduct
); 

router.delete('/products/:id', authenticate, validate(getProductByIdValidation), productController.deleteProduct);
router.patch('/products/:id/restore', authenticate, validate(getProductByIdValidation), productController.restoreProduct);

export default router;