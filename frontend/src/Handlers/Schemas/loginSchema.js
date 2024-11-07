import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address zod"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});
