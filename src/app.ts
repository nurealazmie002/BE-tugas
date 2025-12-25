import dotenv from 'dotenv'; 
dotenv.config(); 

import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';  

import productRoutes from './routes/product.route'; 
import categoryRoutes from './routes/category.route';
import storeRoutes from './routes/store.route'; 
import userRoutes from './routes/user.route';
import transactionRoutes from './routes/transaction.route';
import authRoutes from './routes/auth.route'; 
import profileRoutes from './routes/profile.route';

import { errorHandler } from './middlewares/error.handler';
import { setupSwagger } from './swagger';

const app = express();

setupSwagger(app);

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use((req: any, res, next) => { 
  req.startTime = Date.now();
  
  const apiKey = req.headers['x-api-key'] as string;
  
  if (!apiKey) {
    return res.status(401).json({ 
      success: false, 
      message: 'Akses ditolak: Kirim header X-API-Key' 
    });
  }
  
  req.apiKey = apiKey;
  next();
});

app.get('/', (req: any, res) => {
  const waktu = Date.now() - (req.startTime || 0);
  res.json({ 
      message: `Halo pemilik API Key: ${req.apiKey}! Hari 5 – MVC E-Commerce + Service`, 
      waktu_proses: `${waktu}ms` 
  });
});

app.use('/api/v1', authRoutes);         
app.use('/api/v1', productRoutes);      
app.use('/api/v1', categoryRoutes);     
app.use('/api/v1', storeRoutes);        
app.use('/api/v1', userRoutes);         
app.use('/api/v1', transactionRoutes);  
app.use('/api/v1', profileRoutes);

app.use(errorHandler);

export default app;