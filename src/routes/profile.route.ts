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

router.get('/profiles', profileController.getAllProfiles);
router.get('/profiles/user/:userId', validate(getUserIdParamValidation), profileController.getProfileByUserId);

router.get('/profile/me', authenticate, profileController.getMyProfile); 

router.post('/profile',
  authenticate,
  upload.single('image'),
  validate(createProfileValidation),
  profileController.createProfile
);

router.put('/profile',
  authenticate,
  upload.single('image'),
  validate(updateProfileValidation),
  profileController.updateProfile
);

router.delete('/profile', authenticate, profileController.deleteProfile);

export default router;