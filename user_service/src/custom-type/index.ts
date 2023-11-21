export type CreateUserInput = {
  email: string;
  password: string;
  name: string;
  phone: string;
};

export type CreateAddressInput = {
  street: string;
  postalCode: number;
  city: string;
  country: string;
};

export type AddWishListInput = {
  _id: string;
  name: string;
  description: string;
  unit: number;
  price: number;
  category: string;
  image: string;
  image_detail?: string;
};

export enum Role {
  ADMIN = "admin",
  CUSOMER = "customer",
}
