import * as bcrypt from "bcrypt";

export const hashPassword = async (passwordInput: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(passwordInput, salt);
};

export const validatePassword = async (
  passwordInput: string,
  password: string
) => {
  return await bcrypt.compare(passwordInput, password);
};
