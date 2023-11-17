import CartModel from "../models/cart.model";
import OrderModel, { Product } from "../models/order.model";

export class OrderRepository {
  private orderModel: typeof OrderModel;
  private cartModel: typeof CartModel;

  constructor() {
    this.cartModel = CartModel;
    this.orderModel = OrderModel;
  }

  async getOrdersByUserId(userId: string) {
    return await this.orderModel.find({ userId });
  }

  async getCartByUserId(userId: string) {
    return await this.cartModel.find({ userId });
  }

  async createOrder(userId: string, txnId: number) {
    const cart = await this.cartModel.findOne({ userId });

    if (cart) {
      let amount = 0;
      let cartItems = cart.items;

      if (cartItems.length > 0) {
        cartItems.map((item) => {
          amount += item.product.unit * item.product.price;
        });
      }

      const order = await this.orderModel.create({
        userId,
        amount,
        txnId,
        status: "received",
        items: cartItems,
      });

      cart.items = [];

      const orderResult = await order.save();
      await cart.save();

      return orderResult;
    }

    return null;
  }

  async updateCartItems(
    userId: string,
    item: Product,
    qty: number,
    isRemove: boolean
  ) {
    const cart = await this.cartModel.findOne({ userId });
    const { _id } = item;

    if (cart) {
      let isExist = false;
      let cartItems = cart.items;

      if (cartItems.length > 0) {
        cartItems.map((item) => {
          if (item.product._id.toString() === _id.toString()) {
            if (isRemove) {
              cartItems.splice(cartItems.indexOf(item), 1);
            } else {
              item.unit = item.unit + qty;
            }
            isExist = true;
          }
        });
      }

      if (!isExist && !isRemove) {
        cartItems.push({ product: { ...item }, unit: qty });
      }

      cart.items = cartItems;

      return await cart.save();
    } else {
      return await CartModel.create({
        userId,
        items: [{ product: { ...item }, unit: qty }],
      });
    }
  }
}
