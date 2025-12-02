import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

let products = [
    { id: 1, nama: "Laptop Gaming", deskripsi: "Intel i7, RTX 3060", harga: 15000000, kategori: "elektronik" },
    { id: 2, nama: "Keyboard Mekanikal", deskripsi: "Blue Switch, RGB", harga: 800000, kategori: "aksesoris" },
    { id: 3, nama: "Mouse Wireless", deskripsi: "Ergonomic, Silent Click", harga: 300000, kategori: "aksesoris" },
    { id: 4, nama: "Kamera DSLR", deskripsi: "24MP, Full HD", harga: 5000000, kategori: "fotografi" },
    { id: 5, nama: "Smartphone", deskripsi: "Android, 6GB RAM", harga: 1000000, kategori: "elektronik" },
    { id: 6, nama: "Jersey e-sport T1 Faker", deskripsi: "Kualitas Premium", harga: 500000, kategori: "apparel" },
];

app.get('/', (req: Request, res: Response) => {
    res.json({
        message: "Selamat datang di API E-Commerce!",
        hari: 3,
        status: "By, Naufal Hibatullah"
    });
});


app.get("/api/products/categories", (req: Request, res: Response) => {
    const { kategori } = req.query;
    let result = products;

    if (!kategori) {
        return res.status(400).json({
            success: false,
            message: "Parameter 'kategori' wajib disertakan."
        });
    }

    const searchKategori = (kategori as string).toLocaleLowerCase();
    result = result.filter(p => p.kategori.toLowerCase().includes(searchKategori));

    if (result.length === 0) {
        return res.status(404).json({
            success: false,
            message: `Produk dengan kategori '${kategori}' tidak ditemukan`
        });
    }

    res.json({
        success: true,
        jumlah: result.length,
        filtered_result: result
    });
});

app.get('/api/searchname', (req: Request, res: Response) => {
    const { name } = req.query;
    let result = products;

    if (name) {
        result = result.filter(p => p.nama.toLowerCase().includes((name as string).toLowerCase()));
    }

    res.json({
        success: true,
        filtered_result: result
    });
});

app.get('/api/search', (req: Request, res: Response) => {
    const { name, max_price } = req.query;
    let result = products;

    if (name) {
        result = result.filter(p => p.nama.toLowerCase().includes((name as string).toLowerCase()));
    }

    if (max_price) {
        result = result.filter(p => p.harga <= Number(max_price));
    }

    res.json({
        success: true,
        filtered_result: result
    });
});

app.get('/api/products', (req: Request, res: Response) => {
    res.json({
        success: true,
        jumlah: products.length,
        data: products
    });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Produk tidak ditemukan"
        });
    }

    res.json({
        success: true,
        data: product
    });
});


app.post('/api/products', (req: Request, res: Response) => {
    const { nama, deskripsi, harga, kategori } = req.body;

    const newProduct = {
        id: products.length + 1,
        nama,
        deskripsi,
        harga: Number(harga),
        kategori
    };

    products.push(newProduct);

    res.status(201).json({
        success: true,
        message: "Produk berhasil ditambahkan",
        data: newProduct
    });
});

app.put('/api/products/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ success: false, message: "Produk tidak ada" });
    }

    products[index] = { ...products[index], ...req.body };

    res.json({
        success: true,
        message: "Produk berhasil diupdate",
        data: products[index]
    });
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ success: false, message: "Produk tidak ada" });
    }

    const deleted = products.splice(index, 1);

    res.json({
        success: true,
        message: "Produk berhasil dihapus",
        data: deleted[0]
    });
});

app.listen(PORT, () => {
    console.log(`Server jalan → http://localhost:${PORT}`);
    console.log(`Coba buka semua route di atas pakai Postman!`);
});