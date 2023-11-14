import express, { Express } from "express";
import { UserController } from "../controllers/user.controller";
import { validationResource } from "../middlewares/validation-resource";
import {
  getProfileSchema,
  loginSchema,
  registerSchema,
} from "../dtos/user.dto";
import { createAddressSchema, deleteAddressSchema } from "../dtos/address.dto";
import { auth } from "../middlewares/auth";
import { Channel } from "amqplib";
export default (app: Express, channel: Channel) => {
  const userController = new UserController(channel);
  app.post("/login", validationResource(loginSchema), userController.login);
  app.post(
    "/register",
    validationResource(registerSchema),
    userController.register
  );
  app.post(
    "/address",
    auth,
    validationResource(createAddressSchema),
    userController.createAddress
  );
  app.delete(
    "/address/:addressId",
    auth,
    validationResource(deleteAddressSchema),
    userController.deleteAddress
  );
  app.get(
    "/:userId",
    auth,
    validationResource(getProfileSchema),
    userController.getProfile
  );
  app.get("/order-details");
  app.get("/wishlist");
};

// export default app;
