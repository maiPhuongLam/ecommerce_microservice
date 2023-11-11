import { TypeOf, object, string, number } from "zod";

const getAddressSchema = object({
  params: object({
    userId: string({
      required_error: "adddressId is required",
    }),
  }),
});

const createAddressSchema = object({
  body: object({
    street: string({
      required_error: "Street is required",
    }),
    postalCode: number({
      required_error: "postalCode is required",
    }),
    city: string({
      required_error: "City is required",
    }),
    country: string({
      required_error: "Country is required",
    }),
  }),
});

const deleteAddressSchema = object({
  params: object({
    addressId: string({
      required_error: "adddressId is required",
    }),
  }),
});

type CreateAddressDto = TypeOf<typeof createAddressSchema>;
type DelteAddressDto = TypeOf<typeof deleteAddressSchema>;

export {
  createAddressSchema,
  deleteAddressSchema,
  getAddressSchema,
  CreateAddressDto,
  DelteAddressDto,
};
