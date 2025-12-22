import express from "express";
import { isAuth } from "../middleware/auth.js";
import { checkout, paymentVerification } from "../controllers/payment.js";

const router = express.Router();

router.post("/checkout", isAuth, checkout);
router.post("/verify-payment", isAuth, paymentVerification);
export default router;