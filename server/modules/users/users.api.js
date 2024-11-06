//IMPORTS:
import express from "express";
//CONSTANTS:
const userRouter = express.Router();
//LOGIC:
//Api Routes =>
userRouter.get("/", (req, res) => {
  res.status(200).send({ message: "Welcome To Application" });
});
//EXPORTS:
export default userRouter;
