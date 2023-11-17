import config from "../config";
import {
  AddWishListInput,
  CreateAddressInput,
  CreateUserInput,
} from "../custom-type";
import { Product } from "../models/user.model";
import { UserRepository } from "../repositories/user.repository";
import { ApiError } from "../utils/api-error";
import { generateToken } from "../utils/auth-token";
import { formateData } from "../utils/formate-data";
import { hashPassword, validatePassword } from "../utils/password";

export class UserService {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data: CreateUserInput) {
    try {
      const user = await this.userRepository.getUserByEmail(data.email);
      if (user) {
        throw new ApiError(false, 403, "email is exist");
      }

      const hashedPassword = await hashPassword(data.password);
      const newUser = await this.userRepository.createUser({
        ...data,
        password: hashedPassword,
      });
      return formateData(true, 201, "user register success", newUser);
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.userRepository.getUserByEmail(email);
      if (!user) {
        throw new ApiError(false, 404, "email not exist");
      }
      const isEqual = await validatePassword(password, user.password);
      if (!isEqual) {
        throw new ApiError(false, 401, "password is inecorrect");
      }
      const token = await generateToken(
        { _id: user._id.toString(), email: user.email },
        config.jwt.accessKey
      );
      return formateData(true, 200, "user login success", token);
    } catch (error) {
      throw error;
    }
  }

  async createAddress(userId: string, data: CreateAddressInput) {
    try {
      const address = await this.userRepository.createAddress(userId, data);
      if (!address) {
        throw new ApiError(false, 400, "create address fail");
      }
      return formateData(true, 201, "create address success", address);
    } catch (error) {
      throw error;
    }
  }

  async deleteAddress(userId: string, addressId: string) {
    try {
      const address = await this.userRepository.deleteAddress(
        userId,
        addressId
      );
      if (!address) {
        throw new ApiError(false, 400, "delete address fail");
      }
      return formateData(true, 201, "delete address success", null);
    } catch (error) {
      throw error;
    }
  }

  async getProfile(userId: string) {
    try {
      const userProfile = await this.userRepository.getUserById(userId);

      if (!userProfile) {
        throw new ApiError(false, 404, "User not found");
      }

      return formateData(true, 200, "Fetch Profile success", userProfile);
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
        throw new ApiError(false, 400, "add item to wishlist fail");
      }
      return formateData(
        true,
        200,
        "add item to wishlist successfully",
        wishlistResult
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
        throw new ApiError(false, 400, "Add item to cart fail");
      }
      return formateData(true, 200, "add item to cart sucessfully", cartResult);
    } catch (error) {
      throw error;
    }
  }

  // async ManageOrder(customerId, order) {
  //   try {
  //     const orderResult = await this.repository.AddOrderToProfile(
  //       customerId,
  //       order
  //     );
  //     return FormateData(orderResult);
  //   } catch (err) {
  //     throw new APIError("Data Not found", err);
  //   }
  // }

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
      // case "CREATE_ORDER":
      //   this.ManageOrder(userId, order);
      //   break;
      case "TEST":
        console.log("TEST LISTEN EVENT");
      default:
        break;
    }
  }
}
