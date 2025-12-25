import { Router } from 'express';
import { validate } from '../utils/validate';
import {
  createProfileValidation,
  updateProfileValidation,
  getUserIdParamValidation,
} from '../middlewares/profile.validation';
import { authenticate } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

import { ProfileRepository } from '../repositories/profile.repository';
import { ProfileService } from '../services/profile.service';
import { ProfileController } from '../controllers/profile.controller';

const router = Router();

const profileRepository = new ProfileRepository();
const profileService = new ProfileService(profileRepository);
const profileController = new ProfileController(profileService);

/**
 * @swagger
 * /profiles:
 *   get:
 *     summary: Get all profiles
 *     description: Mengambil semua data profile
 *     tags: [Profiles]
 *     responses:
 *       200:
 *         description: Profiles fetched successfully
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
 *                         $ref: '#/components/schemas/Profile'
 */
router.get('/profiles', profileController.getAllProfiles);

/**
 * @swagger
 * /profiles/user/{userId}:
 *   get:
 *     summary: Get profile by user ID
 *     description: Mengambil profile berdasarkan user ID
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Profile'
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/profiles/user/:userId', validate(getUserIdParamValidation), profileController.getProfileByUserId);

/**
 * @swagger
 * /profile/me:
 *   get:
 *     summary: Get my profile
 *     description: Mengambil profile user yang sedang login
 *     tags: [Profiles]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/profile/me', authenticate, profileController.getMyProfile); 

/**
 * @swagger
 * /profile:
 *   post:
 *     summary: Create my profile
 *     description: Membuat profile untuk user yang login
 *     tags: [Profiles]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *                 example: Software Developer
 *               phone:
 *                 type: string
 *                 example: "+6281234567890"
 *               address:
 *                 type: string
 *                 example: Jakarta, Indonesia
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Validation error or profile already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/profile',
  authenticate,
  upload.single('image'),
  validate(createProfileValidation),
  profileController.createProfile
);

/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Update my profile
 *     description: Update profile user yang login
 *     tags: [Profiles]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Profile'
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/profile',
  authenticate,
  upload.single('image'),
  validate(updateProfileValidation),
  profileController.updateProfile
);

/**
 * @swagger
 * /profile:
 *   delete:
 *     summary: Delete my profile
 *     description: Menghapus profile user yang login
 *     tags: [Profiles]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/profile', authenticate, profileController.deleteProfile);

export default router;