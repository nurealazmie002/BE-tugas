import prisma from '../prisma';
import type { Store, Prisma, Product } from '../generated/client';

type StoreWithProducts = Store & { products: Product[] };

export class StoreRepository {
  private userSelect = {
    username: true,
    email: true
  };

  async findAll(skip: number, take: number): Promise<Store[]> {
    return prisma.store.findMany({
      skip,
      take,
      include: {
        user: {
          select: this.userSelect
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async count(): Promise<number> {
    return prisma.store.count();
  }

  async findById(id: string): Promise<Store | null> {
    return prisma.store.findUnique({
      where: { id }
    });
  }

  async findByIdWithProducts(id: string): Promise<StoreWithProducts | null> {
    return prisma.store.findUnique({
      where: { id },
      include: {
        products: true
      }
    });
  }

  async create(data: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    description?: string;
    userId: string;
  }): Promise<Store> {
    return prisma.store.create({
      data
    });
  }

  async update(id: string, data: Prisma.StoreUpdateInput): Promise<Store> {
    return prisma.store.update({
      where: { id },
      data
    });
  }

  async remove(id: string): Promise<Store> {
    return prisma.store.delete({
      where: { id }
    });
  }

  async search(
    keyword: string,
    skip: number,
    take: number
  ): Promise<Store[]> {
    return prisma.store.findMany({
      skip,
      take,
      where: {
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } },
          { address: { contains: keyword, mode: 'insensitive' } }
        ]
      },
      include: {
        user: {
          select: this.userSelect
        }
      }
    });
  }

  async searchCount(keyword: string): Promise<number> {
    return prisma.store.count({
      where: {
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } },
          { address: { contains: keyword, mode: 'insensitive' } }
        ]
      }
    });
  }
}
