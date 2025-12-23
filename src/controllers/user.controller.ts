import type { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { successResponse } from '../utils/response';

export class UserController {
  constructor(private userService: UserService) {}

  getAllUser = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAllUser();
      return successResponse(res, 'Users fetched successfully', users, 200);
    } catch (error) {
      next(error);
    }
  }

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserById(req.params.id!);
      return successResponse(res, 'User fetched successfully', user, 200);
    } catch (error) {
      next(error);
    }
  }

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.createUser(req.body);
      return successResponse(res, 'User created successfully', user, 201);
    } catch (error) {
      next(error);
    }
  }

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.updateUser(req.params.id!, req.body);
      return successResponse(res, 'User updated successfully', user, 200);
    } catch (error) {
      next(error);
    }
  }

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.deleteUser(req.params.id!);
      return successResponse(res, 'User deleted successfully', user, 200);
    } catch (error) {
      next(error);
    }
  }
}