import { Router } from 'express';
import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    searchCategories
} from '../controllers/category.controller';
import { validate } from '../utils/validate';
import { 
    createCategoryValidation, 
    getCategoryByIdValidation
} from '../middlewares/category.validation';
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get('/categories', getAllCategories);
router.get('/categories/search', searchCategories); 
router.get('/categories/:id', validate(getCategoryByIdValidation), getCategoryById);
router.post('/categories', authenticate, validate(createCategoryValidation), createCategory);
router.put('/categories/:id', authenticate, validate(createCategoryValidation), updateCategory);
router.delete('/categories/:id', authenticate, validate(getCategoryByIdValidation), deleteCategory);

export default router;