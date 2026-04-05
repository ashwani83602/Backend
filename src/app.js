import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
// my app ceepts json data and limit set
app.use(express.json({ limit: "16kb" }));
// space ka url encoded hota ha %20 example hai
//ki hum data url se bhi get kr sakte hai configuration krte hai hum
//object ke andar object (nested object ) allow krte hai { extended: true } krke
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // for storing files in folder
// for access and set cookies in browser
app.use(cookieParser());

// routes (segrigation of file)
import userRouter from "./routes/user.routes.js";

app.use("/api/v1/users", userRouter);
export { app };
