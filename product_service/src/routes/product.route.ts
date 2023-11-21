import express, { Express, Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { auth } from "../middlewares/auth";
import { validationResource } from "../middlewares/validation-resource";
import {
  addProductToCartSchema,
  createProductSchema,
  getProductSchema,
  getProductsQuerySchema,
  updateProductSchema,
} from "../dtos/product.dto";
import { Channel } from "amqplib";
import { adminRole } from "../middlewares/roles";

export class ProductRouter {
  public router: Router;
  private productController: ProductController;

  constructor(channel: Channel) {
    this.router = Router();
    this.productController = new ProductController(channel);
    this.postProductRouter();
    this.getProductsRouter();
    this.getProductRouter();
    this.patchProductRouter();
    this.deleteProductRouter();
    this.putWishlistRouter();
    this.addItemToCartRouter();
    this.deleteItemFromCartRouter();
  }

  private postProductRouter() {
    this.router.post(
      "/",
      auth,
      adminRole,
      validationResource(createProductSchema),
      this.productController.createProduct
    );
  }

  private getProductsRouter() {
    this.router.get(
      "/",
      // auth,
      validationResource(getProductsQuerySchema),
      this.productController.getProducts
    );
  }

  private getProductRouter() {
    this.router.get(
      "/:productId",
      auth,
      validationResource(getProductSchema),
      this.productController.getProduct
    );
  }

  private patchProductRouter() {
    this.router.patch(
      "/:productId",
      auth,
      adminRole,
      validationResource(updateProductSchema),
      this.productController.updateProduct
    );
  }

  private deleteProductRouter() {
    this.router.delete(
      "/:productId",
      auth,
      adminRole,
      validationResource(getProductSchema),
      this.productController.deleteProduct
    );
  }

  private putWishlistRouter() {
    this.router.put(
      "/wishlist/:productId",
      auth,
      validationResource(getProductSchema),
      this.productController.addOrRemoveProductToWishlist
    );
  }

  private addItemToCartRouter() {
    this.router.put(
      "/cart/:productId",
      auth,
      validationResource(addProductToCartSchema),
      this.productController.addProductToCart
    );
  }

  private deleteItemFromCartRouter() {
    this.router.delete(
      "/cart/:productId",
      auth,
      validationResource(addProductToCartSchema),
      this.productController.removeItemFromCart
    );
  }
}

// export default app;
