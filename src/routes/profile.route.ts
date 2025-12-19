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

router.get('/profiles', getAllProfiles);
router.get('/profiles/user/:userId', validate(getUserIdParamValidation), getProfileByUserId);

router.get('/profile/me', authenticate, getMyProfile); 

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