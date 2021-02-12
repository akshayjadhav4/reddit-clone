import { Request, Response, Router } from "express";
import { validate } from "class-validator";

import { User } from "../entities/User";

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  try {
    let errors: any = {};
    // check existing user
    const userEmail = await User.findOne({ email });
    const userUsername = await User.findOne({ username });

    if (userEmail) errors.email = "Email is already taken";
    if (userUsername) errors.username = "Username is already taken";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // create new user
    const user = new User({ email, username, password });

    // validate req.body input
    errors = await validate(user);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    // save user to db
    await user.save();
    // send response
    return res.status(201).json(user);
  } catch (error) {
    console.log("REGISTER USER ERROR", error);
    return res.status(500).json("Something went wrong...");
  }
};

const router = Router();
router.post("/register", register);

export default router;
