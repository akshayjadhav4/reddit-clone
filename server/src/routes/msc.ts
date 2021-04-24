import { Request, Response, Router } from "express";
import { getRepository } from "typeorm";

import auth from "../middlewares/auth";
import User from "../entities/User";
import Post from "../entities/Post";
import Vote from "../entities/Vote";
import Comment from "../entities/Comment";

const vote = async (req: Request, res: Response) => {
  const { identifier, slug, commentIdentifier, value } = req.body;

  //validate vote value
  if (![1, 0, -1].includes(value)) {
    return res.status(400).json({ value: "Value must be 1, 0, -1" });
  }

  try {
    const user: User = res.locals.user;
    let post = await Post.findOneOrFail({ identifier, slug });
    let vote: Vote | undefined;
    let comment: Comment | undefined;

    if (commentIdentifier) {
      comment = await Comment.findOneOrFail({ identifier: commentIdentifier });
      vote = await Vote.findOne({ user, comment });
    } else {
      vote = await Vote.findOne({ user, post });
    }
    if (!vote && value === 0) {
      return res.status(400).json({ value: "Vote not found." });
    } else if (!vote) {
      vote = new Vote({ user, value });
      if (comment) {
        vote.comment = comment;
      } else {
        vote.post = post;
      }
      await vote.save();
    } else if (value === 0) {
      await vote.remove();
    } else if (vote.value !== value) {
      vote.value = value;
      await vote.save();
    }

    post = await Post.findOneOrFail(
      { identifier, slug },
      { relations: ["comments", "comments.votes", "sub", "votes"] }
    );

    post.setUserVote(user);
    post.comments.forEach((comment) => comment.setUserVote(user));
    return res.json(post);
  } catch (error) {
    console.log("ERROR WHILE VOTING");
    return res.status(500).json({ error: "Something went wrong while voting" });
  }
};

const router = Router();
router.post("/vote", auth, vote);

export default router;
