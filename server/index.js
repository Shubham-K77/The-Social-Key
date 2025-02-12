//IMPORTS:
import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import { notFound, errorHandle } from "./middleware/errorMw.js";
import cookie from "cookie-parser";
import { app, server } from "./sockets/socket.js";
//CONSTANTS:
dotenv.config();
const port = process.env.PORT;
const dbUrl = process.env.mongoDbUrl;
//MIDDLEWARES:
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({
    origin: "https://the-social-key.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
  })
);
app.use(cookie());
app.use("/", router);
app.use(notFound);
app.use(errorHandle);
//LOGICS:
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Connected To DataBase!");
    server.listen(port, () => {
      console.log(`App Is Running On Port: ${port}`);
      console.log(`URL => http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
//EXPORTS:
export default app;
