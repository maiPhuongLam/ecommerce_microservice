import { TypeOf, z, number, object, string } from "zod";
import { Category } from "../models/product.model";

const params = object({
  productId: string({
    required_error: "productId is required",
  }),
});
const createProductSchema = object({
  body: object({
    name: string({
      required_error: "name is required",
    }),
    description: string({
      required_error: "desc is required",
    }),
    unit: number({
      required_error: "unit is required",
    }),
    price: number({
      required_error: "price is required",
    }),
    category: z.nativeEnum(Category, {
      required_error: "category is required",
    }),
    image: string({
      required_error: "image is required",
    }).optional(),
    image_detail: string({
      required_error: "image_detail is required",
    }).optional(),
  }),
});

const updateProductSchema = object({
  params,
  body: object({
    name: string({
      required_error: "name is required",
    }).optional(),
    description: string({
      required_error: "desc is required",
    }).optional(),
    unit: number({
      required_error: "unit is required",
    }).optional(),
    price: number({
      required_error: "price is required",
    }).optional(),
    category: z
      .nativeEnum(Category, {
        required_error: "category is required",
      })
      .optional(),
    image: string({
      required_error: "image is required",
    }).optional(),
    image_detail: string({
      required_error: "image_detail is required",
    }).optional(),
  }),
});

const getProductSchema = object({ params });

const getProductsQuerySchema = object({
  query: object({
    search: string().optional(),
    category: string().optional(),
    sort: string().optional(),
    limit: string().optional(),
    skip: string().optional(),
  }),
});

const addProductToCartSchema = object({
  params,
  body: object({
    qty: number({
      required_error: "qty is required",
    }),
  }),
});

type CreateProductDto = TypeOf<typeof createProductSchema>;
type UpdateProductDto = TypeOf<typeof updateProductSchema>;
type GetProductDto = TypeOf<typeof getProductSchema>;
type GetProductQueryDto = TypeOf<typeof getProductsQuerySchema>;
type AddProductTocart = TypeOf<typeof addProductToCartSchema>;
export {
  CreateProductDto,
  UpdateProductDto,
  GetProductDto,
  GetProductQueryDto,
  AddProductTocart,
  createProductSchema,
  updateProductSchema,
  getProductSchema,
  getProductsQuerySchema,
  addProductToCartSchema,
};
