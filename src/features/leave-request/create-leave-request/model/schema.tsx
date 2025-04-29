import { z } from "zod";
import type { ListleaveRequest } from "../../list-leave-request";
import { status } from "../../list-leave-request";
import { format } from "date-fns";

export const vietnamHolidays: { date: string; name: string }[] = [
  { date: "2025-01-01", name: "Tết Dương lịch (New Year's Day)" },
  { date: "2025-04-30", name: "Ngày Giải phóng miền Nam (Reunification Day)" },
  {
    date: "2025-05-01",
    name: "Ngày Quốc tế Lao động (International Workers' Day)",
  },
  { date: "2025-09-02", name: "Quốc khánh (National Day)" },
  {
    date: "2025-04-08",
    name: "Giỗ Tổ Hùng Vương (Hung Kings Commemoration Day)",
  },
  { date: "2025-01-28", name: "Tết - 29 tháng Chạp" },
  { date: "2025-01-29", name: "Tết - 30 tháng Chạp" },
  { date: "2025-01-30", name: "Mùng 1 Tết" },
  { date: "2025-01-31", name: "Mùng 2 Tết" },
  { date: "2025-02-01", name: "Mùng 3 Tết" },
  { date: "2025-02-02", name: "Mùng 4 Tết" },
  { date: "2025-02-03", name: "Mùng 5 Tết" },
  {
    date: "2025-03-08",
    name: "Ngày Quốc tế Phụ nữ (International Women's Day)",
  },
  { date: "2025-06-01", name: "Ngày Quốc tế Thiếu nhi (Children's Day)" },
  { date: "2025-10-20", name: "Ngày Phụ nữ Việt Nam (Vietnamese Women's Day)" },
  { date: "2025-11-20", name: "Ngày Nhà giáo Việt Nam (Teachers' Day)" },
  { date: "2025-12-25", name: "Lễ Giáng Sinh (Christmas Day)" },
  { date: "2025-12-31", name: "New Year's Eve (Optional)" },
  { date: "2025-02-04", name: "Tết - Mùng 6 (Optional)" },
];

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

        const holidaysSet = new Map(
          vietnamHolidays.map((holiday) => [holiday.date, holiday.name])
        );

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dateStr = format(d, "yyyy-MM-dd");
          if (holidaysSet.has(dateStr)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `${dateStr} is holiday: "${holidaysSet.get(dateStr)}"`,
              path: ["end_date"],
            });
          }
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
