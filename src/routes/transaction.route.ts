import { Router } from "express";
import { checkout, getHistory } from "../controllers/transaction.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/transactions/checkout", authenticate, checkout);
router.get("/transactions/history", authenticate, getHistory);

export default router;