import { ParsedOptions } from "qs-to-mongo/lib/query/options-to-mongo";
import { CreateProductInput, UpdateProductInput } from "../custom-type";
import ProductModel, { Category } from "../models/product.model";
import qs2m from "qs-to-mongo";

export class ProductRepository {
  private productModel: typeof ProductModel;

  constructor() {
    this.productModel = ProductModel;
  }

  async createProduct(data: CreateProductInput) {
    return await this.productModel.create(data);
  }

  async getProducts(criteria: Record<string, any>, options: ParsedOptions) {
    options.sort = options.sort || { _id: -1 };
    options.skip = options.skip || 0;
    options.limit = options.limit || 12;
    if (criteria.search) {
      criteria.name = { $regex: new RegExp(criteria.search, "i") };
      delete criteria.search;
    }

    const products = await this.productModel.aggregate([
      { $match: criteria },
      { $sort: options.sort },
      { $skip: options.skip },
      { $limit: options.limit },
    ]);

    const total = await this.productModel.countDocuments(criteria);

    return { total, products };
  }

  async getProductById(productId: string) {
    return await this.productModel.findById(productId);
  }

  async getProductByCategory(category: Category) {
    return await this.productModel.find({ category });
  }

  async updateProduct(productId: string, data: UpdateProductInput) {
    const product = await this.productModel.findByIdAndUpdate(productId, data);
    await product?.save();
    return product;
  }

  async deleteProduct(productId: string) {
    return await this.productModel.findByIdAndDelete(productId);
  }
}
