import { Router } from "express";
import { 
  getAllUser, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/users", authenticate, getAllUser);
router.get("/users/:id", authenticate, getUserById);
router.post("/users", authenticate, createUser); 
router.put("/users/:id", authenticate, updateUser);
router.delete("/users/:id", authenticate, deleteUser);

export default router;