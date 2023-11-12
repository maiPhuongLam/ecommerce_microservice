import express from "express";
import config from "./config";
import connectDb from "./connect-db";
import { MessageBroker } from "./utils/message-broker";
import bodyParser from "body-parser";
import cors from "cors";
import errorHandler from "./middlewares/error-handler";
import productRoute from "./routes/product.route";
const port = config.port || 3001;

const start = async () => {
  const app = express();
  await connectDb();
  await new MessageBroker().connect(config.amqplib.message_broker_url);

  app.use(express.json());
  app.use(cors());
  app.use("/products", productRoute);
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
