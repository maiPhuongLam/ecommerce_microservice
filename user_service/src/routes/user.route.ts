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
import { Router } from "express";

export class UserRouter {
  public router: Router;
  private userController: UserController;

  constructor(chanel: Channel) {
    this.router = Router();
    this.userController = new UserController(chanel);
    this.loginRouter();
    this.registerRouter();
    this.postAddressRouter();
    this.deleteAddressRouter();
    this.getUserRouter();
  }

  private loginRouter() {
    this.router.post(
      "/login",
      validationResource(loginSchema),
      this.userController.login
    );
  }

  private registerRouter() {
    this.router.post(
      "/register",
      validationResource(registerSchema),
      this.userController.register
    );
  }

  private postAddressRouter() {
    this.router.post(
      "/address/",
      auth,
      validationResource(createAddressSchema),
      this.userController.createAddress
    );
  }

  private deleteAddressRouter() {
    this.router.delete(
      "/address/:addressId",
      auth,
      validationResource(deleteAddressSchema),
      this.userController.deleteAddress
    );
  }

  private getUserRouter() {
    this.router.get(
      "/:userId",
      auth,
      validationResource(getProfileSchema),
      this.userController.getProfile
    );
  }
}
