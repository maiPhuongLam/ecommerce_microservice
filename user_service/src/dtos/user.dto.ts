import { TypeOf, date, number, object, string, z } from "zod";
import { Role } from "../custom-type";

const loginSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }),
    password: string({
      required_error: "Password is required",
    }).min(5, "Password to short"),
  }),
});

const registerSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email(),
    password: string({
      required_error: "Password is required",
    }).min(5, "Password to short"),
    name: string({
      required_error: "Name is required",
    }),
    phone: string({
      required_error: "Phone is required",
    }).regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, {
      message: "phone is invalid",
    }),
    role: z.nativeEnum(Role).optional(),
  }),
});

// const resetPasswordSchema = object({
//   body: object({
//     password: string({
//       required_error: "Password is required",
//     }),
//   }),
//   params: object({
//     id: string({
//       required_error: "UserId is required",
//     }),
//   }),
// });

const getProfileSchema = object({
  params: object({
    userId: string({
      required_error: "UserId is required",
    }),
  }),
});

type LoginDto = TypeOf<typeof loginSchema>;
type RegisterDto = TypeOf<typeof registerSchema>;
type GetProfileDto = TypeOf<typeof getProfileSchema>;

// type ResetPasswordDto = TypeOf<typeof resetPasswordSchema>;

export {
  loginSchema,
  registerSchema,
  getProfileSchema,
  LoginDto,
  RegisterDto,
  GetProfileDto,
};
