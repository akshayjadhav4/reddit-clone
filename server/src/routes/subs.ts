import { Request, Response, Router } from "express";
import { isEmpty } from "class-validator";
import { getRepository } from "typeorm";

import auth from "../middlewares/auth";
import Sub from "../entities/Sub";
import user from "../middlewares/user";
import Post from "../entities/Post";

const createSub = async (req: Request, res: Response) => {
  const { name, title, description } = req.body;
  const user = res.locals.user;

  try {
    let errors: any = {};
    if (isEmpty(name)) errors.name = "Name Required";
    if (isEmpty(title)) errors.title = "Title Required";

    const sub = await getRepository(Sub)
      .createQueryBuilder("sub")
      .where("lower(sub.name) = :name", { name: name.toLowerCase() })
      .getOne();

    if (sub) errors.name = "Sub already exists.";
    if (Object.keys(errors).length > 0) {
      throw errors;
    }
  } catch (error) {
    return res.status(400).json({ error });
  }

  try {
    const sub = new Sub({ name, title, description, user });
    await sub.save();
    return res.json(sub);
  } catch (error) {
    console.log("CREATE SUB ERROR", error);
    return res.status(500).json("Something went wrong...");
  }
};

const getSub = async (req: Request, res: Response) => {
  const name = req.params.name;
  try {
    const sub = await Sub.findOneOrFail({ name });
    const posts = await Post.find({
      where: { sub },
      order: { createdAt: "DESC" },
      relations: ["comments", "votes"],
    });
    sub.posts = posts;
    if (res.locals.user) {
      sub.posts.forEach((post) => post.setUserVote(res.locals.user));
    }
    return res.json(sub);
  } catch (error) {
    console.log("ERROR WHILE GETTING SUB BY NAME", error);
    return res.status(404).json({ error: "NO SUB FOUND" });
  }
};

const router = Router();
router.post("/create", user, auth, createSub);
router.get("/getSub/:name", user, getSub);

export default router;
