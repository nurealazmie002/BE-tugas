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

const router = Router();

router.get('/stores', StoreController.getAllStores);
router.get('/stores/search', searchStoresValidation, validate, StoreController.searchStores);
router.get('/stores/:id', getStoreByIdValidation, validate, StoreController.getStoreById);
router.get('/stores/:id/products', getStoreByIdValidation, validate, StoreController.getStoreProducts);
router.post('/stores', createStoreValidation, validate, StoreController.createStore);
router.put('/stores/:id', updateStoreValidation, validate, StoreController.updateStore);
router.delete('/stores/:id', deleteStoreValidation, validate, StoreController.deleteStore);

export default router;