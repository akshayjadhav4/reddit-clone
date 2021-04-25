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

const router = Router();
router.post("/:identifier/:slug/add", user, auth, addComment);

export default router;
