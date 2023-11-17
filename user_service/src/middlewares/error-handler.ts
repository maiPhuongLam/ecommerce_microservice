import { Request, Response, NextFunction } from "express";

const errorHandler = (
  error: Error & { status: number; success: boolean },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("ERROR");
  const message = error.message || "Something went wrong";
  const status = error.status || 500;
  const success = error.success || false;
  return res.status(status).json({ success, message });
};

export default errorHandler;
