import AddressModel from "../models/address.model";
import UserModel from "../models/user.model";

interface CreateUserInput {
  email: string;
  password: string;
  phone: string;
  otp: number;
}

interface CreateAddressInput {
  street: string;
  postalCode: number;
  city: string;
  country: string;
}

interface AddWishListInput {
  _id: string;
  name: string;
  price: string;
}

export const createUser = async (data: CreateUserInput) => {
  return await UserModel.create(data);
};

export const getUserByEmail = async (email: string) => {
  return await UserModel.findOne({ email });
};

export const getUserById = async (id: string) => {
  return await UserModel.findOne({ _id: id });
};

export const getUserByOtpAndEmail = async (otp: string, email: string) => {
  return await UserModel.find({ otp, email });
};

export const updateUser = async (id: string, data: any) => {
  return await UserModel.findByIdAndUpdate(id, data);
};

export const deleteUser = async (id: string) => {
  return await UserModel.findByIdAndDelete(id);
};

export const getAllUsers = async () => {
  return await UserModel.find();
};

export const createAddress = async (
  id: string,
  createAddressInput: CreateAddressInput
) => {
  const user = await getUserById(id);

  if (user) {
    const newAddress = await AddressModel.create(createAddressInput);
    user.address.push(newAddress);
    return await user.save();
  }

  return null;
};

export const getWishlist = async (userId: string) => {
  const user = await UserModel.findById(userId).populate("wishlist");
  if (user) {
    return user.wishlist;
  }
  return null;
};

export const addWishlistItem = async (
  userId: string,
  data: AddWishListInput
) => {
  const user = await UserModel.findById(userId).populate("wishlist");

  if (user) {
    let wishlist = user.wishlist;

    if (wishlist.length > 0) {
      let isExist = false;
      wishlist.map((item) => {
        if (item._id.toString() === data._id.toString()) {
          const index = wishlist.indexOf(item);
          wishlist.splice(index, 1);
          isExist = true;
        }
      });

      if (!isExist) {
        wishlist.push(data);
      }
    } else {
      wishlist.push(data);
    }

    user.wishlist = wishlist;
    await user.save();
    return user.wishlist;
  }

  return null;
};
