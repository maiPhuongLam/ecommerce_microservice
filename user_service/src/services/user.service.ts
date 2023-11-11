import config from "../config";
import { CreateAddressInput, CreateUserInput } from "../custom-type";
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
}
