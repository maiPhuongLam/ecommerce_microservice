import { Channel } from "amqplib";
import { OrderController } from "../controllers/order.controller";
import { Express, Router } from "express";
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

export class OrderRouter {
  public router: Router;
  private orderController: OrderController;

  constructor(channel: Channel) {
    this.router = Router();
    this.orderController = new OrderController(channel);
    this.getCartRouter();
    this.postCartRouter();
    this.getOrderRouter();
  }

  private getCartRouter() {
    this.router.get(
      "/cart",
      auth,
      validationResource(createOrderSchema),
      this.orderController.getCart
    );
  }

  private postCartRouter() {
    this.router.post("/", auth, this.orderController.createOrder);
  }

  private getOrderRouter() {
    this.router.get("/", auth, this.orderController.getOrders);
  }
}
