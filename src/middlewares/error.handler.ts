import type { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';
import { NODE_ENV } from '../utils/env';
import { Prisma } from '#generated/client'; 

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('ERROR:', err.message);

  let statusCode = 400; // Default status code
  let message = err.message || 'Terjadi kesalahan server';

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Data yang Anda cari tidak ditemukan.';
    } else if (err.code === 'P2002') {
      statusCode = 400;
      const target = err.meta?.target;
      const field = Array.isArray(target) ? target.join(', ') : (target as string) || 'field tertentu';
      message = `Nilai untuk ${field} sudah terdaftar di sistem.`;
    }
  }

  if (message.includes('tidak ditemukan')) {
    statusCode = 404;
  }

  return errorResponse(
    res, 
    message, 
    statusCode, 
    NODE_ENV === 'development' ? { stack: err.stack, prismaCode: err.code } : null
  );
};