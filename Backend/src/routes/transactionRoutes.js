import express from "express";
import {
  getTransactions,
  getTransactionById,
  updateTransactionStatus,
  downloadInvoice,
  createTransaction,
} from "../controller/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware); // Protect all transaction routes

router.get("/", getTransactions);
router.post("/", createTransaction); // support checkout/order creation
router.get("/:id", getTransactionById);
router.put("/:id/status", updateTransactionStatus);
router.get("/:id/invoice", downloadInvoice);

export default router;
