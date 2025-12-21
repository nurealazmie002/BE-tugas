import * as TransactionRepository from '../repositories/transaction.repository';

interface CheckoutItem {
  productId: string;
  quantity: number;
}

interface TransactionItemData {
  productId: string;
  quantity: number;
  price: number;
}

export const checkout = async (userId: string, items: CheckoutItem[]) => {
  let total = 0;
  
  const transactionItemsData: TransactionItemData[] = [];

  for (const item of items) {
    const product = await TransactionRepository.findProductById(item.productId);

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

  return TransactionRepository.createWithItems(userId, total, transactionItemsData);
};

export const getTransactionHistory = async (userId: string) => {
  return TransactionRepository.findByUserId(userId);
};