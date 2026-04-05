import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/index.js";
import { app } from "./app.js";
// const app = express();

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`app is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("connection failed", error);
  });
