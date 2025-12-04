import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import productRoutes from './routes/product.route';
import categoryRoutes from './routes/category.route';
import { errorHandler } from './middlewares/error.handler';
import { API_KEY } from './utils/env';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
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
  
  if (apiKey !== API_KEY) {
    return res.status(403).json({
      success: false,
      message: "API Key tidak valid!"
    });
  }
  
  req.apiKey = apiKey as string;
  next();
});

app.get('/', (req: Request, res: Response) => {
  const waktuProses = Date.now() - (req.startTime || Date.now());
  res.json({ 
    success: true,
    message: 'API E-Commerce – Hari 5 (MVC + Service Layer)',
    data: {
      hari: 5,
      status: "Server hidup!",
      arsitektur: "MVC + Service Layer",
      waktuProses: `${waktuProses}ms`,
      apiKey: req.apiKey
    }
  });
});

app.get('/api/error-test', (req: Request, res: Response) => {
  throw new Error('Ini adalah test error yang disengaja!');
});

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

app.use((req: Request, res: Response) => {
  throw new Error(`Route ${req.originalUrl} tidak ada di API E-Commerce`);
});

app.use(errorHandler);

export default app;