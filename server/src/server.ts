import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(2004, async () => {
  console.log("Server Started.");
  try {
    await createConnection();
    console.log("DB CONNCTED");
  } catch (error) {
    console.log("ERROR IN DB CONNECTION", error);
  }
});
