import Stripe from "stripe";
import { Product } from "../models/order.model";
import { OrderRepository } from "../repositories/order.repository";
import { formateData } from "../utils/formate-data";
import config from "../config";
import { BadRequestException, NotFoundException } from "../HttpException";
import client from "../reids";

export class OrderService {
  private oderRepository: OrderRepository;
  private stripe: Stripe;

  constructor() {
    this.oderRepository = new OrderRepository();
    this.stripe = new Stripe(config.stripe.secret_key, {
      apiVersion: "2023-10-16",
    });
  }

  async getOrders(userId: string) {
    try {
      const cacheData = await client.get(`user:${userId}`);
      if (cacheData) {
        return formateData(
          true,
          "fetch cart items successfully",
          JSON.parse(cacheData).orders
        );
      }
      const orders = await this.oderRepository.getOrdersByUserId(userId);
      return formateData(true, "fetch orders successfully", orders);
    } catch (error) {
      throw error;
    }
  }

  async getCartItems(userId: string) {
    try {
      const cacheData = await client.get(`user:${userId}`);
      if (cacheData) {
        return formateData(
          true,
          "fetch cart items successfully",
          JSON.parse(cacheData).cart
        );
      }
      const cart = await this.oderRepository.getCartByUserId(userId);
      if (!cart) {
        throw new NotFoundException("cart not found");
      }
      await client.set(`cart:${cart.userId}`, JSON.stringify(cart));
      return formateData(true, "fetch cart items successfully", cart);
    } catch (error) {
      throw error;
    }
  }

  async placeOrder(_id: string, txnId: string) {
    try {
      const order = await this.oderRepository.createOrder(_id, txnId);

      if (!order) {
        throw new BadRequestException("create order fail");
      }
      return formateData(true, "create order successfully", order);
    } catch (error) {
      throw error;
    }
  }

  async manageCart(
    userId: string,
    item: Product,
    qty: number,
    isRemove: boolean
  ) {
    try {
      const cartResult = await this.oderRepository.updateCartItems(
        userId,
        item,
        qty,
        isRemove
      );
      return formateData(true, "add cart items successfully", cartResult);
    } catch (error) {
      throw error;
    }
  }

  async checkout(userId: string) {
    console.log(config.stripe.secret_key);
    try {
      const cart = await this.oderRepository.getCartByUserId(userId);
      if (!cart) {
        throw new NotFoundException("Cart not found");
      }

      let amount = 0;
      if (cart.items.length > 0) {
        cart.items.map((item) => {
          amount += item.product.price * item.unit;
        });
      }

      const total = cart.items.map((item) => ({
        unit_amount: item.product.price * 1000,
      }));
      console.log(total);

      const session = await this.stripe.checkout.sessions.create({
        line_items: cart.items.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.product.name,
            },
            unit_amount: item.product.price * 100,
          },
          quantity: item.unit,
        })),
        metadata: {
          user_id: cart.userId.toString(),
        },
        mode: "payment",
        billing_address_collection: "required",
        phone_number_collection: {
          enabled: true,
        },
        payment_method_types: ["card"],
        success_url: config.stripe.successUrl,
        cancel_url: config.stripe.cancelUrl,
      });

      return formateData(true, "Payment", {
        sessionId: session.id,
        url: session.url,
      });
    } catch (error) {
      throw error;
    }
  }

  async webhook(body: Buffer, sig: string) {
    let event;
    try {
      event = await this.stripe.webhooks.constructEvent(
        body,
        sig,
        config.stripe.webhook_secret
      );
      switch (event.type) {
        case "payment_intent.succeeded":
          const paymentIntent = event.data.object;
          console.log("PaymentIntent was successful!");
          break;
        case "payment_method.attached":
          const paymentMethod = event.data.object;
          console.log("PaymentMethod was attached to a Customer!");
          break;
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      return formateData(true, "test", event.data.object);
    } catch (error) {
      throw error;
    }
  }

  async subscribeEvents(payload: string) {
    const { event, data }: { event: string; data: any } = JSON.parse(payload);
    const { userId, product, qty } = data;
    switch (event) {
      case "ADD_TO_CART":
        this.manageCart(userId, product, qty, false);
        break;
      case "REMOVE_FROM_CART":
        this.manageCart(userId, product, qty, true);
        break;
      case "TEST":
        console.log("TEST LISTEN EVENT");
      default:
        break;
    }
  }
}
