import { Request, Response, Router } from "express";
import { validate, isEmpty } from "class-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";

import User from "../entities/User";
import auth from "../middlewares/auth";
import user from "../middlewares/user";

const mapErrors = (errors: Object[]) => {
  let mappedErrors: any = {};
  errors.forEach((error: any) => {
    const key = error.property;
    const value = Object.entries(error.constraints)[0][1];
    mappedErrors[key] = value;
  });
  return mappedErrors;
};

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
      return res.status(400).json(errors);
    }

    // create new user
    const user = new User({ email, username, password });

    // validate req.body input
    errors = await validate(user);
    if (errors.length > 0) {
      return res.status(400).json(mapErrors(errors));
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

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    let errors: any = {};
    if (isEmpty(username)) errors.username = "Provide Username";
    if (isEmpty(password)) errors.password = "Provide Password";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }
    // get user
    const user = await User.findOne({ username });
    // if user not exists
    if (!user) {
      return res.status(404).json({ username: "User not found..." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ password: "Password is incorrect..." });
    }
    const token = jwt.sign({ username }, process.env.JWT_SECRET_KEY);
    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600, //in sec
        path: "/", //valid through all app
      })
    );
    return res.json({ user });
  } catch (error) {
    console.log("LOGIN USER ERROR", error);
    return res.status(500).json("Something went wrong...");
  }
};

const isAuthenticated = async (_: Request, res: Response) => {
  return res.json(res.locals.user);
};

const logout = (_: Request, res: Response) => {
  res.set(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/", //valid through all app
    })
  );
  return res.status(200).json({ success: true });
};

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/isAuthenticated", user, auth, isAuthenticated);
router.get("/logout", user, auth, logout);

export default router;
