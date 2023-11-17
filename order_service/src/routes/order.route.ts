import { Channel } from "amqplib";
import { OrderController } from "../controllers/order.controller";
import { Express } from "express";
import { auth } from "../middlewares/auth";

export default (app: Express, channel: Channel) => {
  const orderController = new OrderController(channel);

  app.get("/cart", auth, orderController.getCart);
  app.post("/", auth, orderController.createOrder);
  app.get("/", auth, orderController.getOrders);
};
