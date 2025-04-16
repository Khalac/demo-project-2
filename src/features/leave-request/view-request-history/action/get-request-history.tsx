import { supabase } from "@/utils";
import type { LeaveRequestHistory } from "../leave-request-history-data-type";
export const getRequestHistory = async (request_id: string) => {
  const { data, error } = await supabase
    .from("leave_request_history")
    .select(
      "history_id,request_id, users(user_id, full_name),changed_at,old_data,new_data,change_type"
    )
    .eq("request_id", request_id)
    .order("changed_at", { ascending: true });

  if (error) return { success: false, error: error };
  console.log("hi", data);
  const formattedData: LeaveRequestHistory[] = data.map((item) => ({
    history_id: item.history_id,
    request_id: item.request_id,
    users: item.users[0] || item.users,
    changed_at: item.changed_at,
    old_data: item.old_data,
    new_data: item.new_data,
    change_type: item.change_type,
  }));
  return { success: true, data: formattedData };
};
