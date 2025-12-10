export interface Product {
  id: number;
  name: string;
  price: number;
  description: string | null;
  kategori: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date; 
}

