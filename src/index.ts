import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { body, param, query, validationResult, ValidationChain } from 'express-validator';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

interface CustomRequest extends Request {
  startTime?: number;
}

interface Product {
  id: number;
  nama: string;
  deskripsi: string;
  harga: number;
  kategori: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
  errors?: Array<{
    field: string;
    message: string;
  }> | { stack?: string };
}

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Custom Middleware 1: Tambah timestamp ke setiap request
app.use((req: CustomRequest, res: Response, next: NextFunction) => {
  console.log(`Request masuk: ${req.method} ${req.path}`);
  req.startTime = Date.now();
  next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: "Header X-API-Key wajib diisi untuk akses API!"
    });
  }
  if (apiKey !== 'secret-api-key-123') {
    return res.status(403).json({
      success: false,
      message: "API Key tidak valid!"
    });
  }
  next();
});

let products: Product[] = [
  { id: 1, nama: "Laptop Gaming", deskripsi: "Intel i7, RTX 3060", harga: 15000000, kategori: "elektronik" },
  { id: 2, nama: "Keyboard Mekanikal", deskripsi: "Blue Switch, RGB", harga: 800000, kategori: "aksesoris" },
  { id: 3, nama: "Mouse Wireless", deskripsi: "Ergonomic, Silent Click", harga: 300000, kategori: "aksesoris" },
  { id: 4, nama: "Kamera DSLR", deskripsi: "24MP, Full HD", harga: 5000000, kategori: "fotografi" },
  { id: 5, nama: "Smartphone", deskripsi: "Android, 6GB RAM", harga: 1000000, kategori: "elektronik" },
  { id: 6, nama: "Jersey e-sport T1 Faker", deskripsi: "Kualitas Premium", harga: 500000, kategori: "apparel" },
];

const successResponse = (
  res: Response,
  message: string,
  data: unknown = null,
  pagination: { page: number; limit: number; total: number } | null = null,
  statusCode: number = 200
) => {
  const response: ApiResponse = {
    success: true,
    message,
  };

  if (data !== null) response.data = data;
  if (pagination) response.pagination = pagination;

  return res.status(statusCode).json(response);
};

const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = 400,
  errors: Array<{ field: string; message: string }> | { stack?: string } | null = null
) => {
  const response: ApiResponse = {
    success: false,
    message,
  };

  if (errors) response.errors = errors;

  return res.status(statusCode).json(response);
};

const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorList = errors.array().map(err => ({
      field: err.type === 'field' ? err.path : 'unknown',
      message: err.msg
    }));

    return errorResponse(res, 'Validasi gagal', 400, errorList);
  };
};

const createProductValidation = [
  body('nama')
    .trim()
    .notEmpty().withMessage('Nama produk wajib diisi')
    .isLength({ min: 3 }).withMessage('Nama produk minimal 3 karakter'),
  
  body('deskripsi')
    .trim()
    .notEmpty().withMessage('Deskripsi wajib diisi'),
  
  body('harga')
    .isNumeric().withMessage('Harga harus angka')
    .custom(value => value > 0).withMessage('Harga harus lebih dari 0'),
  
  body('kategori')
    .trim()
    .notEmpty().withMessage('Kategori wajib diisi')
];

const getProductByIdValidation = [
  param('id')
    .isNumeric().withMessage('ID harus angka')
];

const getProductsQueryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page harus angka minimal 1'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit harus angka 1-100')
];

const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};


app.get('/', (req: CustomRequest, res: Response) => {
  const waktuProses = Date.now() - (req.startTime || Date.now());
  successResponse(res, 'API E-Commerce – Hari 4', {
    hari: 4,
    status: "Server hidup!",
    waktuProses: `${waktuProses}ms`
  }, null, 200);
});

app.get('/api/products', validate(getProductsQueryValidation), (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedProducts = products.slice(startIndex, endIndex);

  successResponse(
    res, 
    'Daftar produk', 
    paginatedProducts,
    {
      page,
      limit,
      total: products.length
    }
  );
});

app.get("/api/products/categories", (req: Request, res: Response) => {
  const { kategori } = req.query;

  if (!kategori) {
    throw new Error("Parameter 'kategori' wajib disertakan");
  }

  const searchKategori = (kategori as string).toLowerCase();
  const result = products.filter(p => p.kategori.toLowerCase().includes(searchKategori));

  if (result.length === 0) {
    throw new Error(`Produk dengan kategori '${kategori}' tidak ditemukan`);
  }

  successResponse(res, `Produk kategori '${kategori}'`, {
    jumlah: result.length,
    products: result
  });
});

app.get('/api/searchname', (req: Request, res: Response) => {
  const { name } = req.query;
  let result = products;

  if (name) {
    result = result.filter(p => 
      p.nama.toLowerCase().includes((name as string).toLowerCase())
    );
  }

  successResponse(res, 'Hasil pencarian', {
    jumlah: result.length,
    products: result
  });
});

app.get('/api/search', (req: Request, res: Response) => {
  const { name, max_price } = req.query;
  let result = products;

  if (name) {
    result = result.filter(p => 
      p.nama.toLowerCase().includes((name as string).toLowerCase())
    );
  }

  if (max_price) {
    result = result.filter(p => p.harga <= Number(max_price));
  }

  successResponse(res, 'Hasil pencarian', {
    jumlah: result.length,
    products: result
  });
});

app.get('/api/products/:id', validate(getProductByIdValidation), (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    throw new Error('Produk dengan ID tersebut tidak ditemukan');
  }

  successResponse(res, 'Produk ditemukan', product);
});

app.post('/api/products', validate(createProductValidation), (req: Request, res: Response) => {
  const { nama, deskripsi, harga, kategori } = req.body;

  const newProduct: Product = {
    id: products.length + 1,
    nama,
    deskripsi,
    harga: Number(harga),
    kategori
  };

  products.push(newProduct);

  successResponse(res, 'Produk berhasil ditambahkan', newProduct, null, 201);
});

app.put('/api/products/:id', validate(getProductByIdValidation), (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    throw new Error('Produk tidak ditemukan');
  }

  products[index] = { ...products[index], ...req.body };

  successResponse(res, 'Produk berhasil diupdate', products[index]);
});

app.delete('/api/products/:id', validate(getProductByIdValidation), (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    throw new Error('Produk tidak ditemukan');
  }

  const deleted = products.splice(index, 1);

  successResponse(res, 'Produk berhasil dihapus', deleted[0]);
});


app.get('/api/error-test', (req: Request, res: Response) => {
  throw new Error('Ini adalah test error yang disengaja!');
});

app.get('/api/async-test', asyncHandler(async (req: Request, res: Response) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  successResponse(res, "Async test berhasil!");
}));


app.use((req: Request, res: Response) => {
  throw new Error(`Route ${req.originalUrl} tidak ada di API E-Commerce`);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('ERROR:', err.message);

  const statusCode = err.message.includes('tidak ditemukan') ? 404 : 400;

  errorResponse(
    res, 
    err.message || 'Terjadi kesalahan server', 
    statusCode, 
    process.env.NODE_ENV === 'development' ? { stack: err.stack } : null
  );
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server E-Commerce HARI 4 jalan di http://localhost:${PORT}`);
  console.log(`🔑 Jangan lupa kirim header: X-API-Key: secret-api-key-123\n`);
});