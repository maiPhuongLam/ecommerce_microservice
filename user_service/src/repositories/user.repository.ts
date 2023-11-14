import {
  AddWishListInput,
  CreateAddressInput,
  CreateUserInput,
} from "../custom-type";
import AddressModel from "../models/address.model";
import UserModel from "../models/user.model";

export class UserRepository {
  private userModel: typeof UserModel;

  constructor() {
    this.userModel = UserModel;
  }

  async createUser(data: CreateUserInput) {
    return await this.userModel.create(data);
  }

  async getUserByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async getUserById(id: string) {
    return await this.userModel.findOne({ _id: id });
  }

  async updateUser(id: string, data: any) {
    return await this.userModel.findByIdAndUpdate(id, data);
  }

  async deleteUser(id: string) {
    return await this.userModel.findByIdAndDelete(id);
  }

  async getAllUser() {
    return await this.userModel.find();
  }

  async createAddress(userId: string, createAddressInput: CreateAddressInput) {
    const user = await this.getUserById(userId);

    if (user) {
      const newAddress = await AddressModel.create(createAddressInput);
      user.address.push(newAddress);
      return await user.save();
    }

    return null;
  }

  async deleteAddress(userId: string, addressId: string) {
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
  }

  async getWishlist(userId: string) {
    const user = await this.userModel.findById(userId).populate("wishlist");
    if (user) {
      return user.wishlist;
    }
    return null;
  }

  async addWishlistItem(userId: string, data: AddWishListInput) {
    const user = await this.userModel.findById(userId).populate("wishlist");

    if (user) {
      let wishlist = user.wishlist;

      if (wishlist.length > 0) {
        console.log(wishlist.length);

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
      return user.wishlist;
    }

    return null;
  }
}
