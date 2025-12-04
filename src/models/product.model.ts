export interface Product {
  id: number;
  nama: string;
  deskripsi: string;
  harga: number;
  kategori: string;
  stok: number;
}

export let products: Product[] = [
  { id: 1, nama: "Laptop Gaming", deskripsi: "Intel i7, RTX 3060", harga: 15000000, kategori: "elektronik", stok: 10 },
  { id: 2, nama: "Keyboard Mekanikal", deskripsi: "Blue Switch, RGB", harga: 800000, kategori: "aksesoris", stok: 25 },
  { id: 3, nama: "Mouse Wireless", deskripsi: "Ergonomic, Silent Click", harga: 300000, kategori: "aksesoris", stok: 50 },
  { id: 4, nama: "Kamera DSLR", deskripsi: "24MP, Full HD", harga: 5000000, kategori: "fotografi", stok: 5 },
  { id: 5, nama: "Smartphone", deskripsi: "Android, 6GB RAM", harga: 1000000, kategori: "elektronik", stok: 30 },
  { id: 6, nama: "Jersey e-sport T1 Faker", deskripsi: "Kualitas Premium", harga: 500000, kategori: "apparel", stok: 15 },
];