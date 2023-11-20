import express from "express";
import config from "./config";
import connectDb from "./connect-db";
import errorHandler from "./middlewares/error-handler";
import bodyParser from "body-parser";
import cors from "cors";
import { connect } from "./utils/message-broker";
import orderRoute from "./routes/order.route";
const port = config.port || 3001;

const start = async () => {
  const app = express();
  await connectDb();
  const channel = await connect();
  app.use(express.json());
  app.use(cors());

  orderRoute(app, channel);

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
