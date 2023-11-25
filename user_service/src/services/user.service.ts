import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from "../HttpException";
import config from "../config";
import {
  AddWishListInput,
  CreateAddressInput,
  CreateUserInput,
} from "../custom-type";
import { Order, Product } from "../models/user.model";
import { UserRepository } from "../repositories/user.repository";
import { generateToken } from "../utils/auth-token";
import { formateData } from "../utils/formate-data";
import { hashPassword, validatePassword } from "../utils/password";
import client from "../redis";

export class UserService {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data: CreateUserInput) {
    try {
      const user = await this.userRepository.getUserByEmail(data.email);
      if (user) {
        throw new ForbiddenException("email is exist");
      }

      const hashedPassword = await hashPassword(data.password);
      const newUser = await this.userRepository.createUser({
        ...data,
        password: hashedPassword,
      });
      await client.set(
        `user:${newUser._id.toString()}`,
        JSON.stringify(newUser)
      );
      return formateData(true, "user register success", newUser);
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.userRepository.getUserByEmail(email);

      if (!user) {
        throw new NotFoundException("email not exist");
      }
      const isEqual = await validatePassword(password, user.password);
      if (!isEqual) {
        throw new UnauthorizedException("password is incorrect");
      }
      const token = await generateToken(
        { _id: user._id.toString(), role: user.role },
        config.jwt.accessKey
      );
      return formateData(true, "user login success", token);
    } catch (error) {
      throw error;
    }
  }

  async createAddress(userId: string, data: CreateAddressInput) {
    try {
      const addressResult = await this.userRepository.createAddress(
        userId,
        data
      );
      if (!addressResult) {
        throw new BadRequestException("create address fail");
      }
      await client.set(
        `user:${addressResult._id}`,
        JSON.stringify(addressResult)
      );
      return formateData(true, "create address success", addressResult.address);
    } catch (error) {
      throw error;
    }
  }

  async deleteAddress(userId: string, addressId: string) {
    try {
      const addressResult = await this.userRepository.deleteAddress(
        userId,
        addressId
      );
      if (!addressResult) {
        throw new BadRequestException("delete address fail");
      }
      await client.set(
        `user:${addressResult._id}`,
        JSON.stringify(addressResult)
      );
      return formateData(true, "delete address success", null);
    } catch (error) {
      throw error;
    }
  }

  async getProfile(userId: string) {
    try {
      const cacheData = await await client.get(`user:${userId}`);
      let userProfile;
      if (cacheData) {
        userProfile = JSON.parse(cacheData);
      } else {
        userProfile = await this.userRepository.getUserById(userId);
      }
      if (!userProfile) {
        throw new NotFoundException("User not found");
      }

      return formateData(true, "Fetch Profile success", userProfile);
    } catch (error) {
      throw error;
    }
  }

  async addToWishlist(customerId: string, product: AddWishListInput) {
    try {
      const wishlistResult = await this.userRepository.addWishlistItem(
        customerId,
        product
      );
      if (!wishlistResult) {
        throw new BadRequestException("add item to wishlist fail");
      }
      await client.set(
        `user:${wishlistResult._id}`,
        JSON.stringify(wishlistResult)
      );
      return formateData(
        true,
        "add item to wishlist successfully",
        wishlistResult.wishlist
      );
    } catch (error) {
      throw error;
    }
  }

  async manageCart(
    userId: string,
    product: Product,
    qty: number,
    isRemove: boolean
  ) {
    try {
      const cartResult = await this.userRepository.updateCartItems(
        userId,
        product,
        qty,
        isRemove
      );
      if (!cartResult) {
        throw new BadRequestException("Add item to cart fail");
      }
      await client.set(`user:${cartResult._id}`, JSON.stringify(cartResult));
      return formateData(true, "add item to cart sucessfully", cartResult.cart);
    } catch (error) {
      throw error;
    }
  }

  async manageOrder(userId: string, order: Order) {
    try {
      const orderResult = await this.userRepository.createOrder(userId, order);
      if (!orderResult) {
        throw new BadRequestException("create order fail");
      }
      await client.set(`user:${orderResult._id}`, JSON.stringify(orderResult));
      return formateData(true, "create order successfully", orderResult.orders);
    } catch (error) {
      throw error;
    }
  }

  async subscribeEvents(payload: string) {
    const { event, data }: { event: string; data: any } = JSON.parse(payload);
    switch (event) {
      case "UPDATE_WISHLIST":
        this.addToWishlist(data.userId, data.product);
        break;
      case "ADD_TO_CART":
        this.manageCart(data.userId, data.product, data.qty, false);
        break;
      case "REMOVE_FROM_CART":
        this.manageCart(data.userId, data.product, data.qty, true);
        break;
      case "CREATE_ORDER":
        this.manageOrder(data.userId, data.order);
        break;
      case "TEST":
        console.log("TEST LISTEN EVENT");
      default:
        break;
    }
  }
}
