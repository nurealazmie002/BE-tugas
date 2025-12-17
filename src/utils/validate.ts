import type { Request, Response, NextFunction } from 'express';
import { ZodError, type ZodType } from 'zod';
import { validationResult, type ValidationChain } from 'express-validator';

export const validate = (schemas: ZodType | ValidationChain[]) => 
  async (req: Request, res: Response, next: NextFunction) => {
    
    if (Array.isArray(schemas)) {
      await Promise.all(schemas.map((validation) => validation.run(req)));

      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: errors.array().map((err: any) => ({
          field: err.path || err.param,
          message: err.msg,
        })),
      });
    }

    try {
      await schemas.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validasi gagal',
          errors: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        });
      }
      
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error during validation' 
      });
    }
  };