import { Router } from 'express';
import * as StoreController from '../controllers/store.controller';
import { 
  createStoreValidation, 
  updateStoreValidation, 
  getStoreByIdValidation, 
  deleteStoreValidation,
  searchStoresValidation 
} from '../middlewares/store.validation';
import { validate } from '../utils/validate';
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get('/stores', StoreController.getAllStores);
router.get('/stores/search', validate(searchStoresValidation), StoreController.searchStores);
router.get('/stores/:id', validate(getStoreByIdValidation), StoreController.getStoreById);
router.get('/stores/:id/products', validate(getStoreByIdValidation), StoreController.getStoreProducts);
router.post('/stores', authenticate, validate(createStoreValidation), StoreController.createStore);
router.put('/stores/:id', authenticate, validate(updateStoreValidation), StoreController.updateStore);
router.delete('/stores/:id', authenticate, validate(deleteStoreValidation), StoreController.deleteStore);

export default router;