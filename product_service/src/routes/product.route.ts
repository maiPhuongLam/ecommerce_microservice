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

export default (app: Express, channel: Channel) => {
  const productController = new ProductController(channel);

  app.post(
    "/",
    auth,
    validationResource(createProductSchema),
    productController.createProduct
  );
  app.get(
    "/",
    // auth,
    validationResource(getProductsQuerySchema),
    productController.getProducts
  );
  app.get(
    "/:productId",
    auth,
    validationResource(getProductSchema),
    productController.getProduct
  );
  app.patch(
    "/:productId",
    auth,
    validationResource(updateProductSchema),
    productController.updateProduct
  );
  app.delete(
    "/:productId",
    auth,
    validationResource(getProductSchema),
    productController.deleteProduct
  );
  app.put(
    "/wishlist/:productId",
    auth,
    validationResource(getProductSchema),
    productController.addOrRemoveProductToWishlist
  );
  app.put(
    "/cart/:productId",
    auth,
    validationResource(addProductToCartSchema),
    productController.addProductToCart
  );
  app.delete(
    "/cart/:productId",
    auth,
    validationResource(addProductToCartSchema),
    productController.removeItemFromCart
  );
};

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
      validationResource(updateProductSchema),
      this.productController.updateProduct
    );
  }

  private deleteProductRouter() {
    this.router.delete(
      "/:productId",
      auth,
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
