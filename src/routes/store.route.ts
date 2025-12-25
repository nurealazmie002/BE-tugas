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

/**
 * @swagger
 * /stores:
 *   get:
 *     summary: Get all stores
 *     description: Mengambil semua data toko
 *     tags: [Stores]
 *     responses:
 *       200:
 *         description: Stores fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Store'
 */
router.get('/stores', storeController.getAllStores);

/**
 * @swagger
 * /stores/search:
 *   get:
 *     summary: Search stores
 *     description: Mencari toko berdasarkan keyword
 *     tags: [Stores]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search keyword
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get('/stores/search', validate(searchStoresValidation), storeController.searchStores);

/**
 * @swagger
 * /stores/{id}:
 *   get:
 *     summary: Get store by ID
 *     description: Mengambil toko berdasarkan ID
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Store ID
 *     responses:
 *       200:
 *         description: Store fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Store'
 *       404:
 *         description: Store not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/stores/:id', validate(getStoreByIdValidation), storeController.getStoreById);

/**
 * @swagger
 * /stores/{id}/products:
 *   get:
 *     summary: Get store products
 *     description: Mengambil semua produk dari toko tertentu
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Store ID
 *     responses:
 *       200:
 *         description: Store products fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *       404:
 *         description: Store not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/stores/:id/products', validate(getStoreByIdValidation), storeController.getStoreProducts);

/**
 * @swagger
 * /stores:
 *   post:
 *     summary: Create new store
 *     description: Membuat toko baru (membutuhkan autentikasi)
 *     tags: [Stores]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStoreInput'
 *     responses:
 *       201:
 *         description: Store created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Store'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/stores', authenticate, validate(createStoreValidation), storeController.createStore);

/**
 * @swagger
 * /stores/{id}:
 *   put:
 *     summary: Update store
 *     description: Update toko berdasarkan ID (membutuhkan autentikasi)
 *     tags: [Stores]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Store ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStoreInput'
 *     responses:
 *       200:
 *         description: Store updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Store'
 *       404:
 *         description: Store not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/stores/:id', authenticate, validate(updateStoreValidation), storeController.updateStore);

/**
 * @swagger
 * /stores/{id}:
 *   delete:
 *     summary: Delete store
 *     description: Menghapus toko berdasarkan ID (membutuhkan autentikasi)
 *     tags: [Stores]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Store ID
 *     responses:
 *       200:
 *         description: Store deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Store not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/stores/:id', authenticate, validate(deleteStoreValidation), storeController.deleteStore);

export default router;