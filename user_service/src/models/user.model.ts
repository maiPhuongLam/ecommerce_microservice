import mongoose, { Types } from "mongoose";
import { Address } from "./address.model";
import { Role } from "../custom-type";

export interface Product {
  _id: string;
  name: string;
  description: string;
  unit: number;
  price: number;
  category: string;
  image: string;
  image_detail?: string;
}
interface Cart {
  product: Product;
  unit: number;
}
export interface Order {
  _id: string;
  amount: number;
  date: Date;
}

interface User extends Document {
  email: string;
  password: string;
  phone: string;
  name: string;
  role: Role;
  cart: Cart[];
  wishlist: Product[];
  orders: Order[];
  address: Types.ObjectId[] & Address[];
}

const Schema = mongoose.Schema;
const userSchema = new Schema<User>(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: [{ type: Schema.Types.ObjectId, ref: "Address", require: true }],
    role: {
      type: String,
      required: true,
      enum: ["admin", "customer"],
      default: Role.CUSOMER,
    },
    cart: [
      {
        product: {
          _id: { type: String, required: true },
          name: { type: String },
          price: { type: Number },
          description: {
            type: String,
          },
          unit: { type: Number },
          category: {
            type: String,
            enum: ["Jerseys", "Footwear", "Accessories", "Equipment", "Other"],
          },
          image: { type: String },
          image_detail: { type: String },
        },
        unit: {
          type: Number,
          required: true,
        },
      },
    ],
    wishlist: [
      {
        _id: { type: String, required: true },
        name: { type: String },
        description: { type: String },
        unit: { type: Number },
        category: {
          type: String,
          enum: ["Jerseys", "Footwear", "Accessories", "Equipment", "Other"],
        },
        price: { type: Number },
        image: { type: String },
        image_detail: { type: String },
      },
    ],
    orders: [
      {
        _id: { type: String, required: true },
        amount: { type: Number },
        date: { type: Date, default: Date.now() },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

const UserModel = mongoose.model<User>("User", userSchema);
export default UserModel;
