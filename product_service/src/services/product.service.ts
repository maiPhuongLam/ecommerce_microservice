import { ParsedOptions } from "qs-to-mongo/lib/query/options-to-mongo";
import { CreateProductInput } from "../custom-type";
import { ProductRepository } from "../repositories/product.repository";
import { ApiError } from "../utils/api-error";
import { formateData } from "../utils/formate-data";
import { Category } from "../models/product.model";
import { GetProductDto, GetProductQueryDto } from "../dtos/product.dto";
import qsToMongo from "qs-to-mongo";

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async createProduct(data: CreateProductInput) {
    try {
      const product = await this.productRepository.createProduct(data);

      if (!product) {
        throw new ApiError(false, 400, "create product fail");
      }

      return formateData(true, 201, "create product successfully", product);
    } catch (error) {
      throw error;
    }
  }

  async getProducts(query: any) {
    try {
      const { criteria, options, links } = qsToMongo(query);
      console.log(qsToMongo(query));
      const products = await this.productRepository.getProducts(
        criteria,
        options
      );

      if (products.total === 0) {
        throw new ApiError(false, 404, "products not found");
      }

      return formateData(
        true,
        200,
        "Fetch product successfully",
        products.products
      );
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id: string) {
    try {
      const product = await this.productRepository.getProductById(id);

      if (!product) {
        throw new ApiError(false, 404, "product not found");
      }

      return formateData(
        true,
        200,
        "fetch product by id successfully",
        product
      );
    } catch (error) {
      throw error;
    }
  }

  async getProductByCategory(category: Category) {
    try {
      const product = await this.productRepository.getProductByCategory(
        category
      );

      if (!product.length) {
        throw new ApiError(false, 404, "product not found");
      }

      return formateData(
        true,
        200,
        "fetch product by id successfully",
        product
      );
    } catch (error) {
      throw error;
    }
  }
}
