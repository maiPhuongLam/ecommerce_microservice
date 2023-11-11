import express from "express";
import config from "./config";
import connectDb from "./connect-db";
import { MessageBroker } from "./utils/message-broker";
import errorHandler from "./middlewares/error-handler";
import bodyParser from "body-parser";
import cors from "cors";
import userRoute from "./routes/user.route";
const port = config.port || 3001;

const start = async () => {
  const app = express();
  await connectDb();
  await new MessageBroker().connect(config.amqplib.message_broker_url);

  app.use(express.json());
  app.use(cors());
  app.use("/users", userRoute);
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
