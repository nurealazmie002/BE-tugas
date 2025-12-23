import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import type { ILoginInput, IRegisterInput, ILoginResponse, IUserWithoutPassword } from '../models';

const JWT_SECRET = process.env.JWT_SECRET || '6gcIv7CSI9e3CgDj2J3Y';

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async register(data: IRegisterInput): Promise<IUserWithoutPassword> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    
    if (existingUser) {
      throw new Error('Email sudah terdaftar');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await this.userRepository.create({
      username: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || 'USER',
    });

    const { password, ...userWithoutPassword } = newUser;

    return userWithoutPassword as IUserWithoutPassword;
  }

  async login(data: ILoginInput): Promise<ILoginResponse> {
    const user = await this.userRepository.findByEmail(data.email);
    
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
      user: userWithoutPassword as IUserWithoutPassword, 
      token 
    };
  }
}