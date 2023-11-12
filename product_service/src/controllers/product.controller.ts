import { CreateProductDto, GetProductQueryDto } from "../dtos/product.dto";
import { ProductService } from "../services/product.service";
import { Request, Response, NextFunction } from "express";
export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
    this.createProduct = this.createProduct.bind(this);
    this.getProducts = this.getProducts.bind(this);
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
}
