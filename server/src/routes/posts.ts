import { Request, Response, Router } from "express";
import Post from "../entities/Post";

import auth from "../middlewares/auth";
const createPost = async (req: Request, res: Response) => {
  const { title, body, subName } = req.body;
  const user = res.locals.user;
  if (title.trim() === "") {
    return res.status(400).json({ title: "title must be provided" });
  }

  try {
    //   TODO: Find SUBS
    const post = new Post({ title, body, user, subName });
    await post.save();

    return res.json(post);
  } catch (error) {
    console.log("POST CREATE ERROR", error);
    return res.status(500).json({ error: "Something went wrong..." });
  }
};

const router = Router();
router.post("/create", auth, createPost);

export default router;
