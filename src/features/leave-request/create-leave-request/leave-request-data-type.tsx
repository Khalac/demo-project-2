import { z } from "zod";
import { leaveRequestFormSchema } from "./schema";
export type LeaveRequestData = z.infer<typeof leaveRequestFormSchema>;
