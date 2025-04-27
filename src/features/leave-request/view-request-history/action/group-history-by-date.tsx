import { format } from "date-fns";
import type { LeaveRequestHistory } from "../model/leave-request-history-data-type";
import compareUpdateRequest from "./compare-update-request";

export type HistoryGroup = {
  date: string;
  records: {
    key: string;
    historyId: string;
    requestId: string;
    userChange: {
      user_id: string;
      full_name: string;
    };
    oldValue: any;
    newValue: any;
    atTime: string;
  }[];
};

export const groupHistoryByDate = (
  data: LeaveRequestHistory[]
): HistoryGroup[] => {
  const groups: Record<string, HistoryGroup["records"]> = {};

  data.length !== 0 &&
    data.forEach((item) => {
      const date = format(new Date(item.changed_at), "PPPP");

      if (!groups[date]) groups[date] = [];
      if (item.change_type === "CREATE") {
        groups[date].push({
          key: "create",
          historyId: item.history_id,
          requestId: item.request_id,
          userChange: {
            user_id: item.users.user_id,
            full_name: item.users.full_name,
          },
          oldValue: null,
          newValue: null,
          atTime: format(new Date(item.changed_at), "hh:mm a"),
        });
      } else {
        const historyDifferent = compareUpdateRequest(item).map((change) => ({
          ...change,
          historyId: item.history_id,
          requestId: item.request_id,
        }));
        groups[date].push(...historyDifferent);
      }
    });

  return Object.entries(groups).map(([date, records]) => ({
    date,
    records,
  }));
};
