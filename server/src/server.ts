import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

import authRoutes from "./routes/auth";
import postsRoutes from "./routes/posts";
import subsRoutes from "./routes/subs";
import commentsRoutes from "./routes/comments";
import mscRoutes from "./routes/msc";
import usersRoutes from "./routes/users";
import trim from "./middlewares/trim";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(trim);
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

//access public folder
app.use(express.static("public"));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/subs", subsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/msc", mscRoutes);
app.use("/api/users", usersRoutes);

app.listen(2004, async () => {
  console.log("Server Started.");
  try {
    await createConnection();
    console.log("DB CONNCTED");
  } catch (error) {
    console.log("ERROR IN DB CONNECTION", error);
  }
});
