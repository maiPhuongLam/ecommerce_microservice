import { TypeOf, string, object } from "zod";

const createOrderSchema = object({
  body: object({
    txnId: string({
      required_error: "string is required",
    }),
  }),
});

type CreateOrderDto = TypeOf<typeof createOrderSchema>;

export { CreateOrderDto, createOrderSchema };
