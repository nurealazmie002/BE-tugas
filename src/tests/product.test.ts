import request from 'supertest';
import app from '../app';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_kunci_rahasia';

afterAll(async () => {
  await prisma.$disconnect();
});

describe('GET /api/v1/products', () => {
  it('should return 401 if no X-API-Key provided', async () => {
    const res = await request(app).get('/api/v1/products');
    
    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Akses ditolak: Kirim header X-API-Key');
  });

  it('should return 200 and list of products with valid API key', async () => {
    const res = await request(app)
      .get('/api/v1/products')
      .set('X-API-Key', 'secret-api-key-123');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should return paginated products', async () => {
    const res = await request(app)
      .get('/api/v1/products?page=1&limit=5')
      .set('X-API-Key', 'secret-api-key-123');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('data');
  });
});

describe('POST /api/v1/products (Protected Route)', () => {
  const token = jwt.sign(
    { id: '1', role: 'ADMIN' }, 
    JWT_SECRET
  );

  it('should return 401 if no token provided', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .set('X-API-Key', 'secret-api-key-123')
      .send({
        name: 'Test Product',
        price: 10000,
        stock: 10,
        categoryId: '123'
      });
    
    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Token tidak ditemukan');
  });

  it('should require valid token to access protected route', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .set('X-API-Key', 'secret-api-key-123')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    
    expect([400, 401]).toContain(res.statusCode);
    expect(res.body.success).toBe(false);
  });
});
