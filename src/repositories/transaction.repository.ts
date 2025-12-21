import prisma from '../prisma';
import type { Product, Transaction } from '../generated/client';

export const findProductById = async (id: string): Promise<Product | null> => {
  return prisma.product.findUnique({
    where: { id }
  });
};

interface TransactionItemData {
  productId: string;
  quantity: number;
  price: number;
}

export const createWithItems = async (
  userId: string,
  total: number,
  items: TransactionItemData[]
): Promise<Transaction> => {
  return prisma.$transaction(async (tx) => {
    const newTransaction = await tx.transaction.create({
      data: {
        userId,
        total,
        items: {
          createMany: {
            data: items
          }
        }
      }
    });

    for (const item of items) {
      await tx.transactionItem.create({
        data: {
          transactionId: newTransaction.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }
      });

      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }

    return newTransaction;
  });
};

export const findByUserId = async (userId: string): Promise<Transaction[]> => {
  return prisma.transaction.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};
