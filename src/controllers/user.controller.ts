import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async.handler";
import * as UserServices from "../services/user.service";
import { successResponse } from "../utils/response";

export const getAllUser = asyncHandler(async (_req: Request, res: Response) => {
  const users = await UserServices.getAllUser();
  return successResponse(res, "Users fetched successfully", users, 200);
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserServices.getUserById(req.params.id!);
  return successResponse(res, "User fetched successfully", user, 200);
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserServices.createUser(req.body);
  return successResponse(res, "User created successfully", user, 201);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserServices.updateUser(req.params.id!, req.body);
  return successResponse(res, "User updated successfully", user, 200);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserServices.deleteUser(req.params.id!);
  return successResponse(res, "User deleted successfully", user, 200);
});