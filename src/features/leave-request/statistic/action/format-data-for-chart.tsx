import { format } from "date-fns";
export type DataChart = {
  userId: string;
  name: string;
  totalRequest: number;
  month: string;
};
export function formatDataForChart(data: any[]) {
  const counter: Record<string, DataChart> = {};

  for (const request of data) {
    if (request.status === "APPROVED") {
      const userId = request.user_id;
      const name = request.users?.full_name;

      const date = new Date(request.start_date);
      const month = format(date, "MM-yyyy");

      const key = `${userId}-${month}`;

      if (!counter[key]) {
        counter[key] = {
          userId,
          name,
          totalRequest: 1,
          month,
        };
      } else {
        counter[key].totalRequest += 1;
      }
    }
  }

  return Object.values(counter);
}
