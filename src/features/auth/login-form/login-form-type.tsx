import { z } from "zod";
import { loginSchema } from "./schema";
export type DataLogin = z.infer<typeof loginSchema>;
