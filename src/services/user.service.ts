import type { Prisma, User } from '../generated/client';
import * as UserRepository from '../repositories/user.repository';

export const getAllUser = async (): Promise<User[]> => {
  return UserRepository.findAll();
};

export const getUserById = async (id: string): Promise<User> => {
  const user = await UserRepository.findById(id);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role?: string;
}): Promise<User> => {
  const existingUser = await UserRepository.findByEmail(data.email);

  if (existingUser) {
    throw new Error('User already exists');
  }

  return UserRepository.create({
    username: data.name,
    email: data.email,
    password: data.password,
    role: data.role ?? 'USER'
  });
};

export const updateUser = async (
  id: string,
  data: Prisma.UserUpdateInput
): Promise<User> => {
  await getUserById(id);

  return UserRepository.update(id, data);
};

export const deleteUser = async (id: string): Promise<User> => {
  await getUserById(id);

  return UserRepository.softDelete(id);
};
