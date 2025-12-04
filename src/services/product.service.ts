import { Product, products } from '../models/product.model';

export class ProductService {
  static getAll(page: number = 1, limit: number = 10): { products: Product[], total: number } {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);
    
    return {
      products: paginatedProducts,
      total: products.length
    };
  }

  static getById(id: number): Product {
    const product = products.find(p => p.id === id);
    if (!product) throw new Error('Produk dengan ID tersebut tidak ditemukan');
    return product;
  }

  static getByCategory(kategori: string): Product[] {
    const searchKategori = kategori.toLowerCase();
    const result = products.filter(p => p.kategori.toLowerCase().includes(searchKategori));
    
    if (result.length === 0) {
      throw new Error(`Produk dengan kategori '${kategori}' tidak ditemukan`);
    }
    
    return result;
  }

  static create(data: { nama: string; deskripsi: string; harga: number; kategori: string; stok: number }): Product {
    const newProduct: Product = {
      id: products.length + 1,
      nama: data.nama,
      deskripsi: data.deskripsi,
      harga: Number(data.harga),
      kategori: data.kategori,
      stok: Number(data.stok)
    };
    
    products.push(newProduct);
    return newProduct;
  }

  static update(id: number, data: Partial<Product>): Product {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Produk tidak ditemukan');
    
    products[index] = { ...products[index], ...data };
    return products[index];
  }

  static delete(id: number): Product {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Produk tidak ditemukan');
    
    return products.splice(index, 1)[0];
  }

  static search(name?: string, maxPrice?: number): Product[] {
    let result = products;
    
    if (name) {
      result = result.filter(p => 
        p.nama.toLowerCase().includes(name.toLowerCase())
      );
    }
    
    if (maxPrice) {
      result = result.filter(p => p.harga <= maxPrice);
    }
    
    return result;
  }

  static searchByName(name: string): Product[] {
    return products.filter(p => 
      p.nama.toLowerCase().includes(name.toLowerCase())
    );
  }
}