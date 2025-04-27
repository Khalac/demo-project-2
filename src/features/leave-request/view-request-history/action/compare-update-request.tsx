import type { LeaveRequestHistory } from "../model/leave-request-history-data-type";
import { format } from "date-fns";

const compareUpdateRequest = (data: LeaveRequestHistory) => {
  const diffs: {
    key: string;
    userChange: {
      user_id: string;
      full_name: string;
    };
    oldValue: any;
    newValue: any;
    atTime: string;
  }[] = [];
  for (const key in data.new_data) {
    if (
      JSON.stringify(data.old_data?.[key]) !==
        JSON.stringify(data.new_data?.[key]) &&
      key !== "updated_at"
    ) {
      diffs.push({
        key,
        userChange: data.users,
        oldValue: data.old_data?.[key],
        newValue: data.new_data?.[key],
        atTime: format(new Date(data.changed_at), "hh:mm a"),
      });
    }
  }

  return diffs;
};

export default compareUpdateRequest;
