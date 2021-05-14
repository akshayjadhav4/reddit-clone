import { Request, Response, Router } from "express";
import Comment from "../entities/Comment";

import Post from "../entities/Post";
import auth from "../middlewares/auth";
import user from "../middlewares/user";

const addComment = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  const body = req.body.body;
  const user = res.locals.user;

  try {
    const post = await Post.findOneOrFail({ identifier, slug });
    const comment = new Comment({ body, user, post });
    await comment.save();

    return res.json(comment);
  } catch (error) {
    console.log("Add COMMENT ERROR", error);
    return res.status(500).json({ error: "Something went wrong..." });
  }
};

const getComments = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  try {
    const post = await Post.findOneOrFail({ identifier, slug });
    const comments = await Comment.find({
      where: { post },
      order: { createdAt: "DESC" },
      relations: ["votes"],
    });
    if (res.locals.user) {
      comments.forEach((comment) => comment.setUserVote(res.locals.user));
    }
    return res.json(comments);
  } catch (error) {
    console.log("ERROR WHILE GETTING COMMENTS", error);
    return res.status(500).json({ error: "Something went wrong..." });
  }
};

const router = Router();
router.post("/:identifier/:slug/add", user, auth, addComment);
router.get("/getComments/:identifier/:slug", user, getComments);

export default router;
