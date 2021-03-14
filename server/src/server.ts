import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

import authRoutes from "./routes/auth";
import postsRoutes from "./routes/posts";
import subsRoutes from "./routes/subs";
import trim from "./middlewares/trim";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(trim);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/subs", subsRoutes);

app.listen(2004, async () => {
  console.log("Server Started.");
  try {
    await createConnection();
    console.log("DB CONNCTED");
  } catch (error) {
    console.log("ERROR IN DB CONNECTION", error);
  }
});
