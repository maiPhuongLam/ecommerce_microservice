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
  price: string;
};
