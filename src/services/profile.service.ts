import type { Profile } from '../generated/client';
import { calculateSkip, createPaginatedResponse, type PaginatedResponse } from '../utils/pagination';
import { ProfileRepository } from '../repositories/profile.repository';
import type { ICreateProfile, IUpdateProfile } from '../models';

export class ProfileService {
  constructor(private repository: ProfileRepository) {}

  async getProfileByUserId(userId: string): Promise<Profile | null> {
    return this.repository.findByUserId(userId);
  }

  async getProfileById(id: string): Promise<Profile> {
    const profile = await this.repository.findById(id);

    if (!profile) {
      throw new Error('Profile tidak ditemukan');
    }

    return profile;
  }

  async createProfile(data: ICreateProfile): Promise<Profile> {
    const existingProfile = await this.repository.findByUserId(data.userId);

    if (existingProfile) {
      throw new Error('User sudah memiliki profile');
    }

    const userExists = await this.repository.userExists(data.userId);

    if (!userExists) {
      throw new Error('User tidak ditemukan');
    }

    return this.repository.create({
      name: data.name,
      gender: data.gender ?? null,
      address: data.address ?? null,
      image: data.image ?? null,
      userId: data.userId
    });
  }

  async updateProfile(userId: string, data: IUpdateProfile): Promise<Profile> {
    const profile = await this.repository.findByUserId(userId);

    if (!profile) {
      throw new Error('Profile tidak ditemukan');
    }

    return this.repository.update(userId, {
      ...(data.name && { name: data.name }),
      ...(data.gender !== undefined && { gender: data.gender }),
      ...(data.address !== undefined && { address: data.address }),
      ...(data.image !== undefined && { image: data.image })
    });
  }

  async deleteProfile(userId: string): Promise<Profile> {
    const profile = await this.repository.findByUserId(userId);

    if (!profile) {
      throw new Error('Profile tidak ditemukan');
    }

    return this.repository.remove(userId);
  }

  async getAllProfiles(page: number, limit: number): Promise<PaginatedResponse<Profile>> {
    const skip = calculateSkip(page, limit);

    const [profiles, total] = await Promise.all([
      this.repository.findAll(skip, limit),
      this.repository.count()
    ]);

    return createPaginatedResponse(profiles, page, limit, total);
  }
}