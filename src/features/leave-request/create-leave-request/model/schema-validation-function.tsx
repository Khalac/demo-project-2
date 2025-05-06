// helper.ts
import { format } from "date-fns";
import { vietnamHolidays } from "./vietnam-holiday-data";
import { z } from "zod";
import { status } from "../../list-leave-request";

export const checkLeaveHours = (
  total_leave_days: number,
  total_leave_hours: number,
  ctx: any
) => {
  if (total_leave_days * 8 < total_leave_hours) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        "Total leave hours must not exceed total leave days multiplied by 8",
      path: ["total_leave_hours"],
    });
  }
};

export const checkLeaveDates = (
  start_date: Date,
  end_date: Date,
  total_leave_days: number,
  ctx: any
) => {
  const getTotalDays = Math.ceil(
    (end_date.getTime() - start_date.getTime()) / (1000 * 60 * 60 * 24) + 1
  );

  if (new Date(end_date.getTime() + 7 * 60 * 60 * 1000) < start_date) {
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
};

export const checkHolidays = (start_date: Date, end_date: Date, ctx: any) => {
  const holidaysSet = new Map(
    vietnamHolidays.map((holiday) => [holiday.date, holiday.name])
  );

  for (
    let d = new Date(start_date);
    d <= end_date;
    d.setDate(d.getDate() + 1)
  ) {
    const dateStr = format(d, "yyyy-MM-dd");
    if (holidaysSet.has(dateStr)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${dateStr} is holiday: "${holidaysSet.get(dateStr)}"`,
        path: ["end_date"],
      });
    }
  }
};

export const checkOverlapWithExistingRequests = (
  start_date: Date,
  end_date: Date,
  user_id: string,
  listLeaveRequest: any[],
  ctx: any
) => {
  listLeaveRequest.forEach((lr) => {
    if (user_id === lr.user_id) {
      const existingStart = new Date(lr.start_date).getTime() - 25200000;
      const existingEnd = new Date(lr.end_date).getTime() - 25200000;

      const isOverlap =
        start_date.getTime() <= existingEnd &&
        end_date.getTime() >= existingStart;
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
};
