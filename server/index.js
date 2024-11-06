//Imports
import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./routes/index.js";
//Constants
const app = express();
dotenv.config();
const port = process.env.PORT;
const dbUrl = process.env.mongoDbUrl;
//Middlewares
app.use(express.json());
app.use(cors());
app.use("/", router);
//Logic
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Connected To DataBase!");
    app.listen(port, () => {
      console.log(`App Is Running On Port: ${port}`);
      console.log(`URL => http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
