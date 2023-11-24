import { BadRequestException, NotFoundException } from "../HttpException";
import {
  AddWishListInput,
  CreateAddressInput,
  CreateUserInput,
} from "../custom-type";
import AddressModel from "../models/address.model";
import UserModel, { Order } from "../models/user.model";

export class UserRepository {
  private userModel: typeof UserModel;

  constructor() {
    this.userModel = UserModel;
  }

  async createUser(data: CreateUserInput) {
    try {
      return await this.userModel.create(data);
    } catch (error) {
      throw new BadRequestException("create user fail");
    }
  }

  async getUserByEmail(email: string) {
    try {
      return await this.userModel.findOne({ email });
    } catch (error) {
      throw new BadRequestException("get user by email fail");
    }
  }

  async getUserById(id: string) {
    try {
      return await this.userModel.findOne({ _id: id }).populate("address");
    } catch (error) {
      throw new BadRequestException("get user by id fail");
    }
  }

  async updateUser(id: string, data: any) {
    try {
      return await this.userModel
        .findByIdAndUpdate(id, data)
        .populate("address");
    } catch (error) {}
  }

  async deleteUser(id: string) {
    try {
      return await this.userModel.findByIdAndDelete(id);
    } catch (error) {
      throw new BadRequestException("update user fail");
    }
  }

  async getAllUser() {
    try {
      return await this.userModel.find().populate("address");
    } catch (error) {
      throw new BadRequestException("get all user fail");
    }
  }

  async createAddress(userId: string, createAddressInput: CreateAddressInput) {
    try {
      const user = await this.getUserById(userId);

      if (user) {
        const newAddress = await AddressModel.create(createAddressInput);
        user.address.push(newAddress);
        return await user.save();
      }

      throw new NotFoundException("user not found");
    } catch (error) {
      throw new BadRequestException("create address fail");
    }
  }

  async deleteAddress(userId: string, addressId: string) {
    try {
      const user = await this.getUserById(userId);

      if (user) {
        const address = await AddressModel.findByIdAndDelete(addressId);

        if (!address) {
          return null;
        }

        const index = user.address.indexOf(address);
        user.address.splice(index, 1);
        return await user.save();
      }
    } catch (error) {
      throw new BadRequestException("delete address fail");
    }
  }

  async getWishlist(userId: string) {
    try {
      const user = await this.userModel.findById(userId).populate("wishlist");
      if (user) {
        return user.wishlist;
      }
      throw new NotFoundException("user not found");
    } catch (error) {
      throw new BadRequestException("update user fail");
    }
  }

  async addWishlistItem(userId: string, data: AddWishListInput) {
    try {
      const user = await this.userModel.findById(userId).populate("wishlist");
      console.log(user);
      if (user) {
        let wishlist = user.wishlist;
        console.log(wishlist);
        if (wishlist.length > 0) {
          let isExist = false;
          wishlist.map(async (item) => {
            if (item._id.toString() === data._id.toString()) {
              await this.userModel.findByIdAndUpdate(userId, {
                $pull: {
                  wishlist: {
                    _id: item._id.toString(),
                  },
                },
              });
              isExist = true;
            }
          });

          if (!isExist) {
            await this.userModel.findByIdAndUpdate(userId, {
              $push: { wishlist: data },
            });
          }
        } else {
          await this.userModel.findByIdAndUpdate(userId, {
            $push: { wishlist: data },
          });
        }
        return await user.save();
      }

      throw new NotFoundException("user not found");
    } catch (error) {
      throw new BadRequestException("add wishlist fail");
    }
  }

  async updateCartItems(
    userId: string,
    product: AddWishListInput,
    qty: number,
    isRemove: boolean
  ) {
    try {
      const user = await this.userModel.findById(userId).populate("cart");
      if (user) {
        const cartItem = {
          product,
          unit: qty,
        };

        const cartItems = user.cart;

        if (cartItems.length > 0) {
          let isExist = false;
          cartItems.map((item) => {
            if (item.product._id.toString() === product._id.toString()) {
              if (isRemove) {
                cartItems.splice(cartItems.indexOf(item), 1);
              } else {
                item.unit = item.unit + qty;
              }
              isExist = true;
            }
          });

          if (!isExist) {
            cartItems.push(cartItem);
          }
        } else {
          cartItems.push(cartItem);
        }
        user.cart = cartItems;
        return await user.save();
      } else {
        throw new NotFoundException("user not found");
      }
    } catch (error) {
      throw new BadRequestException("update cart item fail");
    }
  }

  async createOrder(userId: string, order: Order) {
    try {
      const user = await this.userModel.findById(userId).populate("orders");

      if (user) {
        if (user.orders === undefined) {
          user.orders = [];
        }
        user.orders.push(order);
        user.cart = [];
        const userResult = await user.save();
        return userResult;
      } else {
        throw new NotFoundException("user not found");
      }
    } catch (error) {
      throw new BadRequestException("create order fail");
    }
  }
}
