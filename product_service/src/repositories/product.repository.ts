import { ParsedOptions } from "qs-to-mongo/lib/query/options-to-mongo";
import { CreateProductInput, UpdateProductInput } from "../custom-type";
import ProductModel, { Category } from "../models/product.model";
import { BadRequestException, NotFoundException } from "../HttpException";

export class ProductRepository {
  private productModel: typeof ProductModel;

  constructor() {
    this.productModel = ProductModel;
  }

  async createProduct(data: CreateProductInput) {
    try {
      return await this.productModel.create(data);
    } catch (error) {
      throw new BadRequestException("create product fail");
    }
  }

  async getProducts(criteria: Record<string, any>, options: ParsedOptions) {
    try {
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
    } catch (error) {
      throw new BadRequestException("get products fail");
    }
  }

  async getProductById(productId: string) {
    try {
      return await this.productModel.findById(productId);
    } catch (error) {
      throw new BadRequestException("get product by id fail");
    }
  }

  async getProductByCategory(category: Category) {
    try {
      return await this.productModel.find({ category });
    } catch (error) {
      throw new BadRequestException("get product by category fail");
    }
  }

  async updateProduct(productId: string, data: UpdateProductInput) {
    try {
      const product = await this.productModel.findByIdAndUpdate(
        productId,
        data
      );
      if (product) {
        return await this.productModel.findById(productId);
      }
      throw new NotFoundException("product not foumd");
    } catch (error) {
      throw new BadRequestException("update product fail");
    }
  }

  async deleteProduct(productId: string) {
    try {
      const product = await this.getProductById(productId);
      if (product) {
        return await this.productModel.deleteOne({ _id: product._id });
      }
      throw new NotFoundException("product not found");
    } catch (error) {
      throw new BadRequestException("delte product fail");
    }
  }
}
