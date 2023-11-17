import * as jwt from "jsonwebtoken";
import config from "../config";
export const generateToken = async (
  payload: { _id: string; email: string },
  key: string
) => {
  const token = jwt.sign(payload, key, {
    expiresIn: key === config.jwt.accessKey ? "1h" : "7d",
  });

  return token;
};

export const validateToken = async (token: string, key: string) => {
  const payload = (await jwt.verify(token, key)) as {
    _id: string;
    email: string;
  };
  return payload;
};
