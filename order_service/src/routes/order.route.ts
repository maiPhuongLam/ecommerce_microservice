import { Channel } from "amqplib";
import { OrderController } from "../controllers/order.controller";
import { Express } from "express";
import { auth } from "../middlewares/auth";
import { validationResource } from "../middlewares/validation-resource";
import { createOrderSchema } from "../dtos/order.dto";

export default (app: Express, channel: Channel) => {
  const orderController = new OrderController(channel);

  app.get(
    "/cart",
    auth,
    validationResource(createOrderSchema),
    orderController.getCart
  );
  app.post("/", auth, orderController.createOrder);
  app.get("/", auth, orderController.getOrders);
};
