import { z } from "zod";

export const leaveRequestFormSchema = z
  .object({
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
    reason: z.string({ required_error: "Reason is require" }),
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

      const start = new Date(start_date);
      const end = new Date(end_date);

      const getTotalDays =
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;

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
    }
  );
