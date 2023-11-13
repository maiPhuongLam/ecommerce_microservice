import express from "express";
import { ProductController } from "../controllers/product.controller";
import { auth } from "../middlewares/auth";
import { validationResource } from "../middlewares/validation-resource";
import {
  createProductSchema,
  getProductSchema,
  getProductsQuerySchema,
  updateProductSchema,
} from "../dtos/product.dto";

const router = express.Router();

const productController = new ProductController();

router.post(
  "/",
  // auth,
  validationResource(createProductSchema),
  productController.createProduct
);
router.get(
  "/",
  // auth,
  validationResource(getProductsQuerySchema),
  productController.getProducts
);
router.get(
  "/:productId",
  // auth,
  validationResource(getProductSchema),
  productController.getProduct
);
router.patch(
  "/:productId",
  // auth,
  validationResource(updateProductSchema),
  productController.updateProduct
);
router.delete(
  "/:productId",
  // auth,
  validationResource(getProductSchema),
  productController.deleteProduct
);

export default router;
