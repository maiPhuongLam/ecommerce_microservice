import express from "express";
import { ProductController } from "../controllers/product.controller";
import { auth } from "../middlewares/auth";
import { validationResource } from "../middlewares/validation-resource";
import {
  createProductSchema,
  getProductsQuerySchema,
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

export default router;
