import type { User } from '../generated/client';
import { UserRepository } from '../repositories/user.repository';

export type UserUpdateData = {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
};

export class UserService {
  constructor(private repository: UserRepository) {}

  async getAllUser(): Promise<User[]> {
    return this.repository.findAll();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<User> {
    const existingUser = await this.repository.findByEmail(data.email);

    if (existingUser) {
      throw new Error('User already exists');
    }

    return this.repository.create({
      username: data.name,
      email: data.email,
      password: data.password,
      role: data.role ?? 'USER'
    });
  }

  async updateUser(
    id: string,
    data: UserUpdateData
  ): Promise<User> {
    await this.getUserById(id);

    return this.repository.update(id, data);
  }

  async deleteUser(id: string): Promise<User> {
    await this.getUserById(id);

    return this.repository.softDelete(id);
  }
}
