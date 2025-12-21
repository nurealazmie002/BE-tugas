import type { Profile } from '../generated/client';
import { calculateSkip, createPaginatedResponse, type PaginatedResponse } from '../utils/pagination';
import * as ProfileRepository from '../repositories/profile.repository';

interface CreateProfileInput {
  name: string;
  gender?: string;
  address?: string;
  image?: string;
  userId: string;
}

type UpdateProfileInput = Partial<Omit<CreateProfileInput, 'userId'>>;

export const getProfileByUserId = async (userId: string): Promise<Profile | null> => {
  return ProfileRepository.findByUserId(userId);
};

export const getProfileById = async (id: string): Promise<Profile> => {
  const profile = await ProfileRepository.findById(id);

  if (!profile) {
    throw new Error('Profile tidak ditemukan');
  }

  return profile;
};

export const createProfile = async (data: CreateProfileInput): Promise<Profile> => {
  const existingProfile = await ProfileRepository.findByUserId(data.userId);

  if (existingProfile) {
    throw new Error('User sudah memiliki profile');
  }

  const userExists = await ProfileRepository.userExists(data.userId);

  if (!userExists) {
    throw new Error('User tidak ditemukan');
  }

  return ProfileRepository.create({
    name: data.name,
    gender: data.gender ?? null,
    address: data.address ?? null,
    image: data.image ?? null,
    userId: data.userId
  });
};

export const updateProfile = async (userId: string, data: UpdateProfileInput): Promise<Profile> => {
  const profile = await ProfileRepository.findByUserId(userId);

  if (!profile) {
    throw new Error('Profile tidak ditemukan');
  }

  return ProfileRepository.update(userId, {
    ...(data.name && { name: data.name }),
    ...(data.gender !== undefined && { gender: data.gender }),
    ...(data.address !== undefined && { address: data.address }),
    ...(data.image !== undefined && { image: data.image })
  });
};

export const deleteProfile = async (userId: string): Promise<Profile> => {
  const profile = await ProfileRepository.findByUserId(userId);

  if (!profile) {
    throw new Error('Profile tidak ditemukan');
  }

  return ProfileRepository.remove(userId);
};

export const getAllProfiles = async (page: number, limit: number): Promise<PaginatedResponse<Profile>> => {
  const skip = calculateSkip(page, limit);

  const [profiles, total] = await Promise.all([
    ProfileRepository.findAll(skip, limit),
    ProfileRepository.count()
  ]);

  return createPaginatedResponse(profiles, page, limit, total);
};