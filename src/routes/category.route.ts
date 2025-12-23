import { Router } from 'express';
import { validate } from '../utils/validate';
import { 
  createCategoryValidation, 
  getCategoryByIdValidation
} from '../middlewares/category.validation';
import { authenticate } from '../middlewares/auth.middleware';

import { CategoryRepository } from '../repositories/category.repository';
import { CategoryService } from '../services/category.service';
import { CategoryController } from '../controllers/category.controller';

const router = Router();

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

router.get('/categories', categoryController.getAllCategories);
router.get('/categories/search', categoryController.searchCategories); 
router.get('/categories/:id', validate(getCategoryByIdValidation), categoryController.getCategoryById);
router.post('/categories', authenticate, validate(createCategoryValidation), categoryController.createCategory);
router.put('/categories/:id', authenticate, validate(createCategoryValidation), categoryController.updateCategory);
router.delete('/categories/:id', authenticate, validate(getCategoryByIdValidation), categoryController.deleteCategory);

export default router;