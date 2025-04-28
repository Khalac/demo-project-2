import { z } from "zod";

export const ForgotPasswordFormSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email(),
});
export type ForgotPasswordType = z.infer<typeof ForgotPasswordFormSchema>;
