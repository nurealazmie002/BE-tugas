import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';

import { TransactionRepository } from '../repositories/transaction.repository';
import { TransactionService } from '../services/transaction.service';
import { TransactionController } from '../controllers/transaction.controller';

const router = Router();

const transactionRepository = new TransactionRepository();
const transactionService = new TransactionService(transactionRepository);
const transactionController = new TransactionController(transactionService);

router.post('/transactions/checkout', authenticate, transactionController.checkout);
router.get('/transactions/history', authenticate, transactionController.getHistory);

export default router;