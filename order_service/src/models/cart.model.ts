import mongoose from "mongoose";
import { Product } from "./order.model";

const Schema = mongoose.Schema;

interface Cart {
  userId: string;
  items: {
    product: Product;
    unit: number;
  }[];
}

const cartSchema = new Schema<Cart>(
  {
    userId: { type: String },
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
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret._v;
      },
    },
    timestamps: true,
  }
);

const CartModel = mongoose.model<Cart>("Cart", cartSchema);
export default CartModel;
