import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { validateToken } from "../utils/auth-token";
import config from "../config";
import { Role } from "../custom-type";
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return res
      .status(401)
      .json({ success: false, status: 401, message: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];
  let decode;

  try {
    decode = (await validateToken(token, config.jwt.accessKey)) as {
      _id: string;
      role: Role;
    };
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, status: 401, message: "Not authorized" });
  }

  if (!decode) {
    return res
      .status(401)
      .json({ success: false, status: 401, message: "Not authorized" });
  }

  req.userId = decode._id;
  req.userRole = decode.role;
  next();
};
