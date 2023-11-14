import {
  CreateProductDto,
  GetProductDto,
  GetProductQueryDto,
  UpdateProductDto,
} from "../dtos/product.dto";
import { ProductService } from "../services/product.service";
import { Request, Response, NextFunction } from "express";
import { Channel } from "amqplib";
import { publish } from "../utils/message-broker";
import config from "../config";
export class ProductController {
  private productService: ProductService;
  constructor(private channel: Channel) {
    this.productService = new ProductService();
    this.createProduct = this.createProduct.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.getProduct = this.getProduct.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.addProductToWishlist = this.addProductToWishlist.bind(this);
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const input = <CreateProductDto["body"]>req.body;
      const result = await this.productService.createProduct(input);
      return res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const query = <GetProductQueryDto["query"]>req.query;
      const result = await this.productService.getProducts(query);
      return res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = <GetProductDto["params"]>req.params;
      const result = await this.productService.getProductById(productId);
      return res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = <UpdateProductDto["params"]>req.params;
      const body = <UpdateProductDto["body"]>req.body;
      const result = await this.productService.updateProduct(productId, body);
      return res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = <GetProductDto["params"]>req.params;
      const result = await this.productService.deleteProduct(productId);
      return res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }

  async addProductToWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = <GetProductDto["params"]>req.params;
      const userId = req.userId;
      const result = await this.productService.getProductById(productId);
      const payload = {
        event: "ADD_TO_WISHLIST",
        data: { userId, product: result.data },
      };
      publish(
        this.channel,
        config.amqplib.customer_binding_key,
        JSON.stringify(payload)
      );
      return res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }
}
