import { z } from "zod";
import { resetPasswordFormSchema } from "./schema";
export type ResetPassword = z.infer<typeof resetPasswordFormSchema>;
