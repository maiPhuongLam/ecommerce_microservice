import express from "express";
import { UserController } from "../controllers/user.controller";
import { validationResource } from "../middlewares/validation-resource";
import {
  getProfileSchema,
  loginSchema,
  registerSchema,
} from "../dtos/user.dto";
import { createAddressSchema, deleteAddressSchema } from "../dtos/address.dto";
import { auth } from "../middlewares/auth";

const router = express.Router();
const userController = new UserController();

router.post("/login", validationResource(loginSchema), userController.login);
router.post(
  "/register",
  validationResource(registerSchema),
  userController.register
);
router.post(
  "/address",
  auth,
  validationResource(createAddressSchema),
  userController.createAddress
);
router.delete(
  "/address/:addressId",
  auth,
  validationResource(deleteAddressSchema),
  userController.deleteAddress
);
router.get(
  "/:userId",
  auth,
  validationResource(getProfileSchema),
  userController.getProfile
);
router.get("/order-details");
router.get("/wishlist");

export default router;
