import { TypeOf, number, object } from "zod";

const createOrderSchema = object({
  body: object({
    txnNumber: number({
      required_error: "txnNumber is required",
    }),
  }),
});

type CreateOrderDto = TypeOf<typeof createOrderSchema>;

export { CreateOrderDto, createOrderSchema };
