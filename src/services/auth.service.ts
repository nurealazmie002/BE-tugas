import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { User } from '../generated/client';
import * as UserRepository from '../repositories/user.repository';

const JWT_SECRET = process.env.JWT_SECRET || '6gcIv7CSI9e3CgDj2J3Y';

type UserWithoutPassword = Omit<User, 'password'>;

export const register = async (data: { name: string; email: string; password: string, role?: string }): Promise<UserWithoutPassword> => {
  const existingUser = await UserRepository.findByEmail(data.email);
  
  if (existingUser) {
    throw new Error('Email sudah terdaftar');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = await UserRepository.create({
    username: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role || 'USER',
  });

  const { password, ...userWithoutPassword } = newUser;

  return userWithoutPassword;
};

export const login = async (data: { email: string; password: string }) => {
  const user = await UserRepository.findByEmail(data.email);
  
  if (!user) {
    throw new Error('Email atau Password salah');
  }

  const isValid = await bcrypt.compare(data.password, user.password);
  
  if (!isValid) {
    throw new Error('Email atau Password salah');
  }

  const token = jwt.sign(
    { id: user.id, role: user.role || 'USER' }, 
    JWT_SECRET, 
    { expiresIn: '1d' }
  );

  const { password, ...userWithoutPassword } = user;

  return { 
    user: userWithoutPassword, 
    token 
  };
};