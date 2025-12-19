import prisma from '../prisma';
import type { Profile } from '../generated/client';

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
  // Cek apakah user sudah punya profile
  const existingProfile = await prisma.profile.findUnique({
    where: { userId: data.userId }
  });

  if (existingProfile) {
    throw new Error('User sudah memiliki profile');
  }

  // Cek apakah user exists
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
  // Cek profile exists
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

export const getAllProfiles = async (): Promise<Profile[]> => {
  return await prisma.profile.findMany({
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
  });
};