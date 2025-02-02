//IMPORTS:
import express from "express";
import userRouter from "../modules/users/users.api.js";
import postRouter from "../modules/posts/posts.api.js";
import paymentRouter from "../modules/payment/payment.api.js";
//CONSTANTS:
const router = express.Router();
//ROUTING:
router.use("/api/v1/users/", userRouter);
router.use("/api/v1/posts/", postRouter);
router.use("/api/v1/payments/", paymentRouter);
//EXPORTS:
export default router;
