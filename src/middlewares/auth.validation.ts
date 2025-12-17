import { z, ZodType } from 'zod'; 

export const registerValidation: ZodType = z.object({
  body: z.object({
    name: z.string().min(3, 'Nama minimal 3 karakter'),
    email: z.string().email('Format email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    role: z.enum(['USER', 'ADMIN']).optional()
  })
});

export const loginValidation: ZodType = z.object({
  body: z.object({
    email: z.string().email('Format email tidak valid'),
    password: z.string().min(1, 'Password harus diisi')
  })
});