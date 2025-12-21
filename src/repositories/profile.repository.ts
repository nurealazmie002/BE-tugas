import prisma from '../prisma';
import type { Profile } from '../generated/client';

const userSelect = {
  id: true,
  username: true,
  email: true,
  role: true
};

export const findByUserId = async (userId: string): Promise<Profile | null> => {
  return prisma.profile.findUnique({
    where: { userId },
    include: {
      user: {
        select: userSelect
      }
    }
  });
};

export const findById = async (id: string): Promise<Profile | null> => {
  return prisma.profile.findUnique({
    where: { id },
    include: {
      user: {
        select: userSelect
      }
    }
  });
};

export const findAll = async (skip: number, take: number): Promise<Profile[]> => {
  return prisma.profile.findMany({
    skip,
    take,
    include: {
      user: {
        select: userSelect
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const count = async (): Promise<number> => {
  return prisma.profile.count();
};

export const create = async (data: {
  name: string;
  gender?: string | null;
  address?: string | null;
  image?: string | null;
  userId: string;
}): Promise<Profile> => {
  return prisma.profile.create({
    data: {
      name: data.name,
      gender: data.gender ?? null,
      address: data.address ?? null,
      image: data.image ?? null,
      userId: data.userId
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    }
  });
};

export const update = async (
  userId: string,
  data: {
    name?: string;
    gender?: string;
    address?: string;
    image?: string;
  }
): Promise<Profile> => {
  return prisma.profile.update({
    where: { userId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.gender !== undefined && { gender: data.gender }),
      ...(data.address !== undefined && { address: data.address }),
      ...(data.image !== undefined && { image: data.image })
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    }
  });
};

export const remove = async (userId: string): Promise<Profile> => {
  return prisma.profile.delete({
    where: { userId }
  });
};

export const userExists = async (userId: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  return !!user;
};
