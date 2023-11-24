import { Channel } from "amqplib";
import { OrderController } from "../controllers/order.controller";
import { Express, Router } from "express";
import { auth } from "../middlewares/auth";
import { validationResource } from "../middlewares/validation-resource";
import { createOrderSchema } from "../dtos/order.dto";
import bodyParser from "body-parser";

export class OrderRouter {
  public router: Router;
  private orderController: OrderController;

  constructor(channel: Channel) {
    this.router = Router();
    this.orderController = new OrderController(channel);
    this.getCartRouter();
    this.postCartRouter();
    this.getOrderRouter();
    this.postCheckoutRouter();
    this.postWebhook();
  }

  private getCartRouter() {
    this.router.get("/cart", auth, this.orderController.getCart);
  }

  private postCheckoutRouter() {
    this.router.post("/checkout", auth, this.orderController.checkout);
  }

  private postWebhook() {
    this.router.post(
      "/webhook",
      bodyParser.raw({ type: "application/json" }),
      this.orderController.webhook
    );
  }

  private postCartRouter() {
    this.router.post("/", auth, this.orderController.createOrder);
  }

  private getOrderRouter() {
    this.router.get("/", auth, this.orderController.getOrders);
  }
}
