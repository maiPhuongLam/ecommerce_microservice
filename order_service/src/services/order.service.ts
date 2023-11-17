import { Product } from "../models/order.model";
import { OrderRepository } from "../repositories/order.repository";
import { ApiError } from "../utils/api-error";
import { formateData } from "../utils/formate-data";

export class OrderService {
  private oderRepository: OrderRepository;

  constructor() {
    this.oderRepository = new OrderRepository();
  }

  async getOrders(userId: string) {
    try {
      const orders = await this.oderRepository.getOrdersByUserId(userId);
      return formateData(true, 200, "fetch orders successfully", orders);
    } catch (error) {
      throw error;
    }
  }

  async getCartItems(userId: string) {
    try {
      const carts = await this.oderRepository.getCartByUserId(userId);
      return formateData(true, 200, "fetch cart items successfully", carts);
    } catch (error) {
      throw error;
    }
  }

  async placeOrder(_id: string, txnNumber: number) {
    try {
      const order = await this.oderRepository.createOrder(_id, txnNumber);

      if (!order) {
        throw new ApiError(false, 400, "create order fail");
      }
      return formateData(true, 200, "create order successfully", order);
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
      return formateData(true, 200, "add cart items successfully", cartResult);
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
