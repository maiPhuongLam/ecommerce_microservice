import mongoose from "mongoose";

const Schema = mongoose.Schema;

export enum Category {
  Jerseys = "Jerseys",
  Footwear = "Footwear",
  Accessories = "Accessories",
  Equipment = "Equipment",
  Other = "Other",
}

interface Product {
  name: string;
  description: string;
  unit: number;
  price: number;
  category: Category;
  image: string;
  image_detail?: string;
}

const productSchema = new Schema<Product>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  unit: { type: Number, required: true },
  price: { type: Number, required: true },
  category: { type: String, enum: Category },
  image: {
    type: String,
    required: true,
    default:
      "https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg",
  },
  image_detail: { type: String },
});

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
