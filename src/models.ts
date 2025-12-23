export interface IProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
  categoryId: string;
  storeId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ICreateProduct {
  name: string;
  price: number;
  stock: number;
  description?: string;
  categoryId: string;
  storeId: string;
  image?: string;
}

export interface IUpdateProduct {
  name?: string;
  price?: number;
  stock?: number;
  description?: string;
  categoryId?: string;
  storeId?: string;
  image?: string;
}

export interface ICategory {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateCategory {
  name: string;
  description?: string;
}

export interface IUpdateCategory {
  name?: string;
  description?: string;
}

export interface IStore {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  description: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateStore {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
  userId: string;
}

export interface IUpdateStore {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type IUserWithoutPassword = Omit<IUser, 'password'>;

export interface ICreateUser {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface IUpdateUser {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IRegisterInput {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface ILoginResponse {
  user: IUserWithoutPassword;
  token: string;
}

export interface ITransaction {
  id: string;
  userId: string;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransactionItem {
  id: string;
  transactionId: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface ICheckoutItem {
  productId: string;
  quantity: number;
}

export interface ITransactionItemData {
  productId: string;
  quantity: number;
  price: number;
}

export interface IProfile {
  id: string;
  name: string;
  gender: string | null;
  address: string | null;
  image: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateProfile {
  name: string;
  gender?: string;
  address?: string;
  image?: string;
  userId: string;
}

export interface IUpdateProfile {
  name?: string;
  gender?: string;
  address?: string;
  image?: string;
}
