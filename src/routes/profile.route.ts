import { Router } from 'express';
import {
  getAllProfiles,
  getProfileByUserId,
  getMyProfile,
  createProfile,
  updateProfile,
  deleteProfile,
} from '../controllers/profile.controller';
import { validate } from '../utils/validate';
import {
  createProfileValidation,
  updateProfileValidation,
  getUserIdParamValidation,
} from '../middlewares/profile.validation';
import { authenticate } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// Public routes (bisa diakses tanpa auth, tapi butuh API key)
router.get('/profiles', getAllProfiles);
router.get('/profiles/user/:userId', validate(getUserIdParamValidation), getProfileByUserId);

// Protected routes (butuh authentication)
router.get('/profile/me', authenticate, getMyProfile); // Get profile user yang login

router.post('/profile',
  authenticate,
  upload.single('image'),
  validate(createProfileValidation),
  createProfile
);

router.put('/profile',
  authenticate,
  upload.single('image'),
  validate(updateProfileValidation),
  updateProfile
);

router.delete('/profile', authenticate, deleteProfile);

export default router;