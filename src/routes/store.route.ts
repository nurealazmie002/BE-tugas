import { Router } from 'express';
import { 
  createStoreValidation, 
  updateStoreValidation, 
  getStoreByIdValidation, 
  deleteStoreValidation,
  searchStoresValidation 
} from '../middlewares/store.validation';
import { validate } from '../utils/validate';
import { authenticate } from '../middlewares/auth.middleware';

import { StoreRepository } from '../repositories/store.repository';
import { StoreService } from '../services/store.service';
import { StoreController } from '../controllers/store.controller';

const router = Router();

const storeRepository = new StoreRepository();
const storeService = new StoreService(storeRepository);
const storeController = new StoreController(storeService);

router.get('/stores', storeController.getAllStores);
router.get('/stores/search', validate(searchStoresValidation), storeController.searchStores);
router.get('/stores/:id', validate(getStoreByIdValidation), storeController.getStoreById);
router.get('/stores/:id/products', validate(getStoreByIdValidation), storeController.getStoreProducts);
router.post('/stores', authenticate, validate(createStoreValidation), storeController.createStore);
router.put('/stores/:id', authenticate, validate(updateStoreValidation), storeController.updateStore);
router.delete('/stores/:id', authenticate, validate(deleteStoreValidation), storeController.deleteStore);

export default router;