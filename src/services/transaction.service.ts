import { TransactionRepository } from '../repositories/transaction.repository';
import type { ICheckoutItem, ITransactionItemData } from '../models';

export class TransactionService {
  constructor(private repository: TransactionRepository) {}

  async checkout(userId: string, items: ICheckoutItem[]) {
    let total = 0;
    
    const transactionItemsData: ITransactionItemData[] = [];

    for (const item of items) {
      const product = await this.repository.findProductById(item.productId);

      if (!product) {
        throw new Error('Product not found');
      }

      if (product.stock < item.quantity) {
        throw new Error(`Not enough stock for product ${product.name || item.productId}`);
      }

      const price = Number(product.price);
      total += price * item.quantity;

      transactionItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: price
      });
    }

    return this.repository.createWithItems(userId, total, transactionItemsData);
  }

  async getTransactionHistory(userId: string) {
    return this.repository.findByUserId(userId);
  }
}