import { format } from "date-fns";
import type { LeaveRequestHistory } from "../leave-request-history-data-type";
import compareUpdateRequest from "./compare-update-request";

export type HistoryGroup = {
  date: string;
  records: {
    key: string;
    userChange: {
      user_id: string;
      full_name: string;
    };
    oldValue: any;
    newValue: any;
    atTime: string;
  }[];
};

const groupHistoryByDate = (data: LeaveRequestHistory[]): HistoryGroup[] => {
  const groups: Record<string, HistoryGroup["records"]> = {};

  data.forEach((item) => {
    const date = format(new Date(item.changed_at), "PPPP");
    const historyDifferent = compareUpdateRequest(item);

    if (!groups[date]) groups[date] = [];

    groups[date].push(...historyDifferent);
  });

  return Object.entries(groups).map(([date, records]) => ({
    date,
    records,
  }));
};

export default groupHistoryByDate;
