import type { Request, Response, NextFunction } from 'express';
import { TransactionService } from '../services/transaction.service';
import { successResponse } from '../utils/response';

export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  checkout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, items } = req.body;
      const result = await this.transactionService.checkout(userId, items);
      return successResponse(res, 'Transaction created successfully', result, 201);
    } catch (error) {
      next(error);
    }
  }

  getHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const history = await this.transactionService.getTransactionHistory(req.params.userId!);
      return successResponse(res, 'Transaction history fetched successfully', history, 200);
    } catch (error) {
      next(error);
    }
  }
}