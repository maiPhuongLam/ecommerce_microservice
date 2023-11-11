import mongoose, { Types } from "mongoose";
import { Address } from "./address.model";

interface Cart {
  product: {
    _id: string;
    name: string;
    price: number;
    category: string;
  };
  unit: string;
}

interface Item {
  _id: string;
  name: string;
  price: string;
}

interface Order {
  _id: string;
  amount: number;
  date: Date;
}

interface User extends Document {
  email: string;
  password: string;
  phone: string;
  name: string;
  cart: Cart[];
  wishlist: Item[];
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
    cart: [
      {
        product: {
          _id: { type: String, required: true },
          name: { type: String },
          price: { type: Number },
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
        price: { type: Number },
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
        delete ret.password;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

const UserModel = mongoose.model<User>("User", userSchema);
export default UserModel;
