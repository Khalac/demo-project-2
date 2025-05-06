import { z } from "zod";
import {
  checkLeaveHours,
  checkLeaveDates,
  checkHolidays,
  checkOverlapWithExistingRequests,
} from "./schema-validation-function";
import type { ListleaveRequest } from "../../list-leave-request";
import { status } from "../../list-leave-request";
export const leaveRequestFormSchema = (
  listLeaveRequest: ListleaveRequest[],
  user_id: string
) =>
  z
    .object({
      user_id: z.string().optional(),
      start_date: z.coerce.date({
        required_error: "Start date is required",
      }),
      end_date: z.coerce.date({
        required_error: "End date is required",
      }),
      total_leave_days: z.coerce.number({
        required_error: "Total leave days is required",
      }),
      total_leave_hours: z.coerce.number({
        required_error: "Total leave hours is required",
      }),
      reason: z.string().min(1, { message: "Reason is required" }),
      status: z.nativeEnum(status).optional(),
      rejected_reason: z
        .string()
        .nullable()
        .optional()
        .transform((val) => val ?? ""),
    })
    .superRefine(
      (
        {
          start_date,
          end_date,
          total_leave_days,
          total_leave_hours,
        }: {
          start_date: Date;
          end_date: Date;
          total_leave_days: number;
          total_leave_hours: number;
        },
        ctx
      ) => {
        checkLeaveHours(total_leave_days, total_leave_hours, ctx);
        checkLeaveDates(start_date, end_date, total_leave_days, ctx);
        checkHolidays(start_date, end_date, ctx);
        checkOverlapWithExistingRequests(
          start_date,
          end_date,
          user_id,
          listLeaveRequest,
          ctx
        );
      }
    );
