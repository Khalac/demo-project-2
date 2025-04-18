import { z } from "zod";
import type { ListleaveRequest } from "../list-leave-request";
import { status } from "../list-leave-request";

export const leaveRequestFormSchema = (
  listLeaveRequest: ListleaveRequest[],
  user_id: string
) =>
  z
    .object({
      user_id: z.string().optional(),
      start_date: z.coerce.date({
        required_error: "Start date is require",
      }),
      end_date: z.coerce.date({
        required_error: "End date is require",
      }),
      total_leave_days: z.coerce.number({
        required_error: "Total leave days is require",
      }),
      total_leave_hours: z.coerce.number({
        required_error: "Total leave hours is require",
      }),
      reason: z.string().min(1, { message: "Reason is require" }),
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
        if (total_leave_days * 8 < total_leave_hours) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Total leave hours must not exceed total leave days multiplied by 8",
            path: ["total_leave_hours"],
          });
        }

        const start = start_date;
        const end = end_date;

        const getTotalDays = Math.ceil(
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1
        );

        if (end < start) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "You are requesting days that are in the past",
            path: ["end_date"],
          });
        } else if (getTotalDays < total_leave_days) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Total leave days must not exceed the actual number of days between start and end dates.`,
            path: ["total_leave_days"],
          });
        }
        listLeaveRequest.forEach((lr) => {
          if (user_id === lr.user_id) {
            const existingStart = new Date(lr.start_date).getTime() - 25200000;
            const existingEnd = new Date(lr.end_date).getTime() - 25200000;

            const isOverlap =
              start.getTime() <= existingEnd && end.getTime() >= existingStart;
            if (
              isOverlap &&
              lr.status !== status.rejected &&
              lr.status !== status.cancel
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                  "You are requesting days that overlap with another leave request",
                path: ["end_date"],
              });
            }
          }
        });
      }
    );
