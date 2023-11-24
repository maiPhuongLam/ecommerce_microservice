import { NextFunction, Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { consume, publish } from "../utils/message-broker";
import { Channel } from "amqplib";
import config from "../config";
import { CreateOrderDto } from "../dtos/order.dto";

export class OrderController {
  private orderService: OrderService;

  constructor(private channel: Channel) {
    this.orderService = new OrderService();
    consume(this.channel, this.orderService);
    this.createOrder = this.createOrder.bind(this);
    this.getCart = this.getCart.bind(this);
    this.getOrders = this.getOrders.bind(this);
    this.checkout = this.checkout.bind(this);
    this.webhook = this.webhook.bind(this);
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      const { txnId } = <CreateOrderDto["body"]>req.body;
      const result = await this.orderService.placeOrder(userId, txnId);
      const payload = {
        event: "CREATE_ORDER",
        data: {
          userId,
          order: result.data,
        },
      };
      publish(
        this.channel,
        config.amqplib.user_binding_key,
        JSON.stringify(payload)
      );
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      const result = await this.orderService.getOrders(userId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      const result = await this.orderService.getCartItems(userId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async checkout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      const result = await this.orderService.checkout(userId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async webhook(req: Request, res: Response, next: NextFunction) {
    try {
      const rawBody = req.body as Buffer;
      const sig = req.headers["stripe-signature"] as string;
      console.log(rawBody, sig);
      const result = await this.orderService.webhook(rawBody, sig);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
