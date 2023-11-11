import mongoose from "mongoose";
import config from "./config";

export default async () => {
  try {
    await mongoose.connect(config.db_url);
    console.log("==CONNECT DB SUCCESSFULLY==");
  } catch (error) {
    console.log("==ERROR==");
    console.log(error);
    process.exit(1);
  }
};
