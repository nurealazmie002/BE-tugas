import prisma from "../prisma";

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
    const product = await prisma.product.findUnique({
      where: {
        id: item.productId
      }
    });

    if (!product) {
      throw new Error("Product not found");
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

  const result = await prisma.$transaction(async (tx) => {
    const newTransaction = await tx.transaction.create({
      data: {
        userId,
        total,
        items: {
          createMany: {
            data: transactionItemsData
          }
        }}
    });

    for (const data of transactionItemsData) {
      await tx.transactionItem.create({
        data: {
          transactionId: newTransaction.id,
          productId: data.productId,
          quantity: data.quantity,
          price: data.price
        }
      });

      await tx.product.update({
        where: {
          id: data.productId
        },
        data: {
          stock: {
            decrement: data.quantity
          }
        }
      });
    }

    return newTransaction;
  });

  return result;
};

export const getTransactionHistory = async (userId: string) => {
  return await prisma.transaction.findMany({
    where: {
      userId
    },
    include: {
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};