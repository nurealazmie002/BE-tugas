import { Router } from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  deleteCategory
} from '../controllers/category.controller';
import { 
  validate
} from '../middlewares/product.validation';
import {
  createCategoryValidation,
  getCategoryByIdValidation
} from '../middlewares/category.validation';

const router = Router();

router.get('/', getAllCategories);
router.get('/:id', validate(getCategoryByIdValidation), getCategoryById);
router.post('/', validate(createCategoryValidation), createCategory);
router.delete('/:id', validate(getCategoryByIdValidation), deleteCategory);

export default router;