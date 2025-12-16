import { Router } from "express";
import { checkout, getHistory } from "../controllers/transaction.controller";

const router = Router()

router.post("/transactions/checkout", checkout )
router.get("/transactions/history", getHistory)

export default router