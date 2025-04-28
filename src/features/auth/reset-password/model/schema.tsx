import { z } from "zod";

export const resetPasswordFormSchema = z
  .object({
    password: z
      .string({ required_error: "Password is required" })
      .min(1, { message: "Password is required" })
      .min(6, "Must have at least 6 characters")
      .max(30, "Must have maximum 30 characters"),
    repassword: z.string(),
  })
  .superRefine(
    (
      { password, repassword }: { password: string; repassword: string },
      ctx
    ) => {
      if (password != repassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Repassword incorrect",
          path: ["repassword"],
        });
      }
    }
  );
