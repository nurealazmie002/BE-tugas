import { Category, categories } from '../models/category.model';

export class CategoryService {
  static getAll(): Category[] {
    return categories;
  }

  static getById(id: number): Category {
    const category = categories.find(c => c.id === id);
    if (!category) throw new Error('Kategori dengan ID tersebut tidak ditemukan');
    return category;
  }

  static create(data: { nama: string }): Category {
    const exists = categories.find(c => c.nama.toLowerCase() === data.nama.toLowerCase());
    if (exists) {
      throw new Error('Kategori dengan nama tersebut sudah ada');
    }

    const newCategory: Category = {
      id: categories.length + 1,
      nama: data.nama.toLowerCase()
    };
    
    categories.push(newCategory);
    return newCategory;
  }

  static delete(id: number): Category {
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Kategori tidak ditemukan');
    
    return categories.splice(index, 1)[0];
  }
}