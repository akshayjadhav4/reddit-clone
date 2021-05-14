import { NextFunction, Request, Response, Router } from "express";
import { isEmpty } from "class-validator";
import { getRepository } from "typeorm";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";

import auth from "../middlewares/auth";
import Sub from "../entities/Sub";
import user from "../middlewares/user";
import Post from "../entities/Post";
import { makeId } from "../utils/helpers";
import User from "../entities/User";

const createSub = async (req: Request, res: Response) => {
  const { name, title, description } = req.body;
  const user = res.locals.user;

  try {
    let errors: any = {};
    if (isEmpty(name)) errors.name = "Name Required";
    if (isEmpty(title)) errors.title = "Title Required";
    if (isEmpty(description)) errors.description = "Description Required";

    const sub = await getRepository(Sub)
      .createQueryBuilder("sub")
      .where("lower(sub.name) = :name", { name: name.toLowerCase() })
      .getOne();

    if (sub) errors.name = "Sub already exists.";
    if (Object.keys(errors).length > 0) {
      throw errors;
    }
  } catch (error) {
    return res.status(400).json(error);
  }

  try {
    const sub = new Sub({ name, title, description, user });
    await sub.save();
    return res.json(sub);
  } catch (error) {
    console.log("CREATE SUB ERROR", error);
    return res.status(500).json({ error: "Something went wrong..." });
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

const OwnSub = async (req: Request, res: Response, next: NextFunction) => {
  const user: User = res.locals.user;
  try {
    const sub = await Sub.findOneOrFail({ where: { name: req.params.name } });
    if (sub.username !== user.username) {
      return res.status(403).json({ error: "You don't own this sub" });
    }
    res.locals.sub = sub;
    return next();
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong." });
  }
};

const upload = multer({
  storage: multer.diskStorage({
    destination: "public/images",
    filename: (req, file, callback) => {
      const name = makeId(15);
      callback(null, name + path.extname(file.originalname));
    },
  }),
  fileFilter: (_, file: any, callback: FileFilterCallback) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
      callback(null, true);
    } else {
      callback(new Error("Not supported file type"));
    }
  },
});

const handleSubImage = async (req: Request, res: Response) => {
  const sub: Sub = res.locals.sub;
  try {
    const type = req.body.type;
    if (type !== "image" && type !== "banner") {
      fs.unlinkSync(req.file.path); //delete file
      return res.status(400).json({ error: "Invalid Type" });
    }
    const urn = req.file.filename;
    let oldImageURN: string = "";
    if (type === "image") {
      oldImageURN = sub.imageURN || "";
      sub.imageURN = urn;
    } else if (type === "banner") {
      oldImageURN = sub.bannerURN || "";
      sub.bannerURN = urn;
    }

    await sub.save();
    if (oldImageURN !== "") {
      fs.unlinkSync(`public\\images\\${oldImageURN}`);
    }
    return res.json(sub);
  } catch (error) {
    return res.status(500).json({ error: "Error while saving image" });
  }
};

const searchSubs = async (req: Request, res: Response) => {
  try {
    const name = req.params.name;
    if (isEmpty(name)) {
      return res.status(400).json({ error: "Provide valid name" });
    }
    const subs = await getRepository(Sub)
      .createQueryBuilder()
      .where("LOWER(name) LIKE :name", {
        name: `${name.toLowerCase().trim()}%`,
      })
      .getMany();

    return res.json(subs);
  } catch (error) {
    return res.status(500).json({ error: "Error while Searching Subs" });
  }
};

const router = Router();
router.post("/create", user, auth, createSub);
router.get("/getSub/:name", user, getSub);
router.get("/search/:name", searchSubs);
router.post(
  "/:name/image",
  user,
  auth,
  OwnSub,
  upload.single("file"),
  handleSubImage
);

export default router;
