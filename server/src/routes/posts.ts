import { Request, Response, Router } from "express";

import Post from "../entities/Post";
import Sub from "../entities/Sub";

import auth from "../middlewares/auth";
const createPost = async (req: Request, res: Response) => {
  const { title, body, subName } = req.body;
  const user = res.locals.user;
  if (title.trim() === "") {
    return res.status(400).json({ title: "title must be provided" });
  }

  try {
    // Find SUBS
    const subRecord = await Sub.findOneOrFail({ name: subName });

    const post = new Post({ title, body, user, sub: subRecord });
    await post.save();

    return res.json(post);
  } catch (error) {
    console.log("POST CREATE ERROR", error);
    return res.status(500).json({ error: "Something went wrong..." });
  }
};

const getPosts = async (_: Request, res: Response) => {
  try {
    const posts = await Post.find({
      order: { createdAt: "DESC" },
    });
    return res.json(posts);
  } catch (error) {
    console.log("GET POSTS ERROR");
    return res.status(500).json({ error: "Something went wrong..." });
  }
};

const getPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  try {
    const post = await Post.findOneOrFail(
      { identifier, slug },
      { relations: ["sub"] }
    );
    return res.json(post);
  } catch (error) {
    console.log("GET POST ERROR");
    return res.status(404).json({ error: "Post not found." });
  }
};

const router = Router();
router.post("/create", auth, createPost);
router.get("/getPosts", getPosts);
router.get("/getPost/:identifier/:slug", getPost);

export default router;
