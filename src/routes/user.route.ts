import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';

import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';

const router = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.get('/users', authenticate, userController.getAllUser);
router.get('/users/:id', authenticate, userController.getUserById);
router.post('/users', authenticate, userController.createUser); 
router.put('/users/:id', authenticate, userController.updateUser);
router.delete('/users/:id', authenticate, userController.deleteUser);

export default router;