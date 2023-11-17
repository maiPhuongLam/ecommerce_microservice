import {
  AddProductTocart,
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
    this.addOrRemoveProductToWishlist =
      this.addOrRemoveProductToWishlist.bind(this);
    this.addProductToCart = this.addProductToCart.bind(this);
    this.removeItemFromCart = this.removeItemFromCart.bind(this);
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

  async addOrRemoveProductToWishlist(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { productId } = <GetProductDto["params"]>req.params;
      const userId = req.userId;
      const result = await this.productService.getProductById(productId);
      const payload = {
        event: "UPDATE_WISHLIST",
        data: { userId, product: result.data },
      };
      publish(
        this.channel,
        config.amqplib.user_binding_key,
        JSON.stringify(payload)
      );
      return res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }

  async addProductToCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = <AddProductTocart["params"]>req.params;
      const { qty } = <AddProductTocart["body"]>req.body;
      const result = await this.productService.getProductById(productId);
      const payload = {
        event: "ADD_TO_CART",
        data: {
          userId: req.userId,
          product: result.data,
          qty,
        },
      };
      publish(
        this.channel,
        config.amqplib.order_binding_key,
        JSON.stringify(payload)
      );

      publish(
        this.channel,
        config.amqplib.user_binding_key,
        JSON.stringify(payload)
      );
      return res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }

  async removeItemFromCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = <AddProductTocart["params"]>req.params;
      const { qty } = <AddProductTocart["body"]>req.body;
      const result = await this.productService.getProductById(productId);
      const payload = {
        event: "REMOVE_FROM_CART",
        data: {
          userId: req.userId,
          product: result.data,
          qty,
        },
      };
      publish(
        this.channel,
        config.amqplib.order_binding_key,
        JSON.stringify(payload)
      );

      publish(
        this.channel,
        config.amqplib.user_binding_key,
        JSON.stringify(payload)
      );
      return res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }
}
