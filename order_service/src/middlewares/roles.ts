import { Request, Response, NextFunction } from "express";
import { Role } from "../custom-type";

export const adminRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const role = req.userRole;
  if (role !== Role.ADMIN) {
    return res.status(401).json("Not authorized");
  }
  next();
};
