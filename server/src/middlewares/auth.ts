import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { User } from "../entities/User";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) throw new Error("UNAUTHENTICATED: ACCESS DINIED.");

    const { username }: any = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({ username });
    if (!user) throw new Error("User does not exists.");
    res.locals.user = user;
    return next();
  } catch (error) {
    console.log("USER AUTHERNTIATION ERROR", error);
    return res.status(401).json({ error: error.message });
  }
};
