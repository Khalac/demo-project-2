import { format } from "date-fns";
export type DataChart = {
  totalRequest: number;
  month: string;
  status: string;
  year: string;
};
export function formatDataForStatistc(data: any[]) {
  const counter: Record<string, DataChart> = {};

  for (const request of data) {
    const status =
      request.status.charAt(0).toUpperCase() +
      request.status.slice(1).toLowerCase();

    const date = new Date(request.start_date);
    const month = format(date, "M");
    const year = format(date, "yyyy");

    const key = `${status}-${month}-${year}`;

    if (!counter[key]) {
      counter[key] = {
        totalRequest: 1,
        month,
        status,
        year,
      };
    } else {
      counter[key].totalRequest += 1;
    }
  }

  return Object.values(counter);
}
