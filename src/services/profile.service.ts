import prisma from '../prisma';
import type { Profile } from '../generated/client';
import { calculateSkip, createPaginatedResponse, type PaginatedResponse } from '../utils/pagination';

interface CreateProfileInput {
  name: string;
  gender?: string;
  address?: string;
  image?: string;
  userId: string;
}

type UpdateProfileInput = Partial<Omit<CreateProfileInput, 'userId'>>;

export const getProfileByUserId = async (userId: string): Promise<Profile | null> => {
  return await prisma.profile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
        }
      }
    }
  });
};

export const getProfileById = async (id: string): Promise<Profile> => {
  const profile = await prisma.profile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
        }
      }
    }
  });

  if (!profile) {
    throw new Error('Profile tidak ditemukan');
  }

  return profile;
};

export const createProfile = async (data: CreateProfileInput): Promise<Profile> => {
  const existingProfile = await prisma.profile.findUnique({
    where: { userId: data.userId }
  });

  if (existingProfile) {
    throw new Error('User sudah memiliki profile');
  }

  const userExists = await prisma.user.findUnique({
    where: { id: data.userId }
  });

  if (!userExists) {
    throw new Error('User tidak ditemukan');
  }

  return await prisma.profile.create({
    data: {
      name: data.name,
      gender: data.gender ?? null,
      address: data.address ?? null,
      image: data.image ?? null,
      userId: data.userId,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        }
      }
    }
  });
};

export const updateProfile = async (userId: string, data: UpdateProfileInput): Promise<Profile> => {
  const profile = await prisma.profile.findUnique({
    where: { userId }
  });

  if (!profile) {
    throw new Error('Profile tidak ditemukan');
  }

  return await prisma.profile.update({
    where: { userId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.gender !== undefined && { gender: data.gender }),
      ...(data.address !== undefined && { address: data.address }),
      ...(data.image !== undefined && { image: data.image }),
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        }
      }
    }
  });
};

export const deleteProfile = async (userId: string): Promise<Profile> => {
  const profile = await prisma.profile.findUnique({
    where: { userId }
  });

  if (!profile) {
    throw new Error('Profile tidak ditemukan');
  }

  return await prisma.profile.delete({
    where: { userId }
  });
};

export const getAllProfiles = async (page: number, limit: number): Promise<PaginatedResponse<Profile>> => {
  const skip = calculateSkip(page, limit);

  const [profiles, total] = await Promise.all([
    prisma.profile.findMany({
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.profile.count()
  ]);

  return createPaginatedResponse(profiles, page, limit, total);
};