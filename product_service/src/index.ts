import express from "express";
import config from "./config";
import connectDb from "./connect-db";
import bodyParser from "body-parser";
import cors from "cors";
import errorHandler from "./middlewares/error-handler";
import productRoute from "./routes/product.route";
import { connect } from "./utils/message-broker";
const port = config.port || 3001;

const start = async () => {
  const app = express();
  await connectDb();
  const channel = await connect();
  app.use(express.json());
  app.use(cors());
  productRoute(app, channel);
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
