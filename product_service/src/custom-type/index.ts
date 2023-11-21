export type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  unit: number;
  image?: string;
  image_detail?: string;
};

export type UpdateProductInput = {
  name?: string;
  description?: string;
  price?: number;
  unit?: number;
  image?: string;
  image_detail?: string;
};

export enum Role {
  ADMIN = "admin",
  CUSTOMER = "customer",
}
