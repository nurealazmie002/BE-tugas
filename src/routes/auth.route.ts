import { Router } from 'express';
import { validate } from '../utils/validate';
import { registerValidation, loginValidation } from '../middlewares/auth.validation';

import { UserRepository } from '../repositories/user.repository';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post('/auth/register', validate(registerValidation as any), authController.register);
router.post('/auth/login', validate(loginValidation as any), authController.login);

export default router;