import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';
import { validate } from '../utils/validate';
import { registerValidation, loginValidation } from '../middlewares/auth.validation';

const router = Router();

router.post('/auth/register', validate(registerValidation as any), AuthController.register);
router.post('/auth/login', validate(loginValidation as any), AuthController.login);

export default router;