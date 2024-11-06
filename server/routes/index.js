//IMPORTS:
import express from "express";
import userRouter from "../modules/users/users.api.js";
//CONSTANTS:
const router = express.Router();
//ROUTING:
router.use("/api/v1/users/", userRouter);
//EXPORTS:
export default router;
