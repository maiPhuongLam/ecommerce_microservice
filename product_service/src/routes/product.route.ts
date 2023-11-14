import express, { Express } from "express";
import { ProductController } from "../controllers/product.controller";
import { auth } from "../middlewares/auth";
import { validationResource } from "../middlewares/validation-resource";
import {
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
    productController.addProductToWishlist
  );
};

// export default app;
