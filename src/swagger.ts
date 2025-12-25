import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import type { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API Documentation',
      version: '1.0.0',
      description: 'API Documentation untuk E-Commerce Backend dengan Express + Prisma',
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API Key untuk autentikasi',
        },
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Token untuk autentikasi user',
        },
      },
      schemas: {
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', example: 'password123' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
          },
        },

        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['ADMIN', 'USER'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateUserInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
            role: { type: 'string', enum: ['ADMIN', 'USER'], default: 'USER' },
          },
        },
        UpdateUserInput: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'John Doe Updated' },
            email: { type: 'string', format: 'email', example: 'john.updated@example.com' },
          },
        },

        Category: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateCategoryInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'Electronics' },
            description: { type: 'string', example: 'Electronic devices and gadgets' },
          },
        },

        Product: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number', format: 'float' },
            stock: { type: 'integer' },
            image: { type: 'string' },
            categoryId: { type: 'string', format: 'uuid' },
            storeId: { type: 'string', format: 'uuid' },
            category: { $ref: '#/components/schemas/Category' },
            store: { $ref: '#/components/schemas/Store' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateProductInput: {
          type: 'object',
          required: ['name', 'price', 'stock', 'categoryId', 'storeId'],
          properties: {
            name: { type: 'string', example: 'iPhone 15 Pro' },
            description: { type: 'string', example: 'Latest Apple smartphone' },
            price: { type: 'number', example: 15000000 },
            stock: { type: 'integer', example: 100 },
            categoryId: { type: 'string', format: 'uuid' },
            storeId: { type: 'string', format: 'uuid' },
            image: { type: 'string', format: 'binary' },
          },
        },

        Store: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            address: { type: 'string' },
            userId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateStoreInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'Tech Store' },
            description: { type: 'string', example: 'Best tech products' },
            address: { type: 'string', example: 'Jl. Sudirman No. 123' },
          },
        },

        Profile: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            bio: { type: 'string' },
            phone: { type: 'string' },
            address: { type: 'string' },
            image: { type: 'string' },
            userId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateProfileInput: {
          type: 'object',
          properties: {
            bio: { type: 'string', example: 'Software Developer' },
            phone: { type: 'string', example: '+6281234567890' },
            address: { type: 'string', example: 'Jakarta, Indonesia' },
            image: { type: 'string', format: 'binary' },
          },
        },

        Transaction: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            total: { type: 'number', format: 'float' },
            status: { type: 'string', enum: ['PENDING', 'COMPLETED', 'CANCELLED'] },
            items: { type: 'array', items: { $ref: '#/components/schemas/TransactionItem' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        TransactionItem: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            productId: { type: 'string', format: 'uuid' },
            quantity: { type: 'integer' },
            price: { type: 'number', format: 'float' },
            product: { $ref: '#/components/schemas/Product' },
          },
        },
        CheckoutInput: {
          type: 'object',
          required: ['items'],
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: ['productId', 'quantity'],
                properties: {
                  productId: { type: 'string', format: 'uuid' },
                  quantity: { type: 'integer', example: 2 },
                },
              },
            },
          },
        },

        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'array', items: {} },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
                total: { type: 'integer' },
                totalPages: { type: 'integer' },
              },
            },
          },
        },
      },
    },
    security: [
      { ApiKeyAuth: [] },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'E-Commerce API Docs',
  }));
  
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};
