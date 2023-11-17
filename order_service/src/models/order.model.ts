import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  unit: number;
  price: number;
}

interface Order {
  orderId: string;
  userId: string;
  amount: Number;
  status: string;
  txnId: string;
  items: {
    product: Product;
    unit: number;
  }[];
}

const orderSchema = new Schema<Order>({
  orderId: String,
  userId: String,
  amount: Number,
  status: String,
  txnId: String,
  items: [
    {
      product: {
        _id: { type: String, required: true },
        name: { type: String },
        description: { type: String },
        category: {
          type: String,
          enum: ["Jerseys", "Footwear", "Accessories", "Equipment", "Other"],
        },
        unit: { type: Number },
        price: { type: Number },
      },
      unit: { type: Number, required: true },
    },
  ],
});

const OrderModel = mongoose.model<Order>("Order", orderSchema);
export default OrderModel;
