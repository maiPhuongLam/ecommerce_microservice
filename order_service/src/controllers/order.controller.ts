import { NextFunction, Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { consume, publish } from "../utils/message-broker";
import { Channel } from "amqplib";
import config from "../config";

export class OrderController {
  private orderService: OrderService;

  constructor(private channel: Channel) {
    this.orderService = new OrderService();
    consume(this.channel, this.orderService);
    this.createOrder = this.createOrder.bind(this);
    this.getCart = this.getCart.bind(this);
    this.getOrders = this.getOrders.bind(this);
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      const { txnNumber } = req.body;
      const result = await this.orderService.placeOrder(userId, txnNumber);
      const payload = {
        event: "CREATE_ORDER",
        data: {
          userId,
          order: result.data,
        },
      };
      publish(
        this.channel,
        config.amqplib.order_binding_key,
        JSON.stringify(payload)
      );
      return res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      const result = await this.orderService.getOrders(userId);
      return res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      const result = await this.orderService.getCartItems(userId);
      return res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }
}
