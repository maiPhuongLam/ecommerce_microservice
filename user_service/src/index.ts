import express from "express";
import config from "./config";
import connectDb from "./connect-db";
import errorHandler from "./middlewares/error-handler";
import bodyParser from "body-parser";
import cors from "cors";
import userRoute from "./routes/user.route";
import { connect } from "./utils/message-broker";
const port = config.port || 3001;

const start = async () => {
  const app = express();
  const channel = await connect();
  await connectDb();
  app.use(express.json());
  app.use(cors());

  userRoute(app, channel);

  app.use(errorHandler);

  app
    .listen(port, () => {
      console.log(`Server is running on port ${port}`);
    })
    .on("error", (err) => {
      console.log(err);
      process.exit();
    });
};

start();
