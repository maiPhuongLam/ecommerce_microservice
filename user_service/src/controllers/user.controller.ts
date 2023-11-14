import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";
import { GetProfileDto, LoginDto, RegisterDto } from "../dtos/user.dto";
import { CreateAddressDto, DelteAddressDto } from "../dtos/address.dto";
import { connect, consume } from "../utils/message-broker";
import { Channel } from "amqplib";

export class UserController {
  private userService: UserService;
  constructor(private channel: Channel) {
    this.userService = new UserService();
    consume(this.channel, this.userService);
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.createAddress = this.createAddress.bind(this);
    this.deleteAddress = this.deleteAddress.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const body = <RegisterDto["body"]>req.body;
      const result = await this.userService.register(body);
      return res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body = <LoginDto["body"]>req.body;
      const result = await this.userService.login(body.email, body.password);
      return res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }

  async createAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const body = <CreateAddressDto["body"]>req.body;
      const userId = req.userId;
      const result = await this.userService.createAddress(userId, body);
      return res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { addressId } = <DelteAddressDto["params"]>req.params;
      const userId = req.userId;
      const result = await this.userService.deleteAddress(userId, addressId);
      return res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = <GetProfileDto["params"]>req.params;
      const result = await this.userService.getProfile(userId);
      return res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }
}
