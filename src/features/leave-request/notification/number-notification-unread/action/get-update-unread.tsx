import { supabase } from "@/utils";
import type { LeaveRequestHistory } from "@/features/leave-request/view-request-history";

export const getUpdateUnread = async (user_id: string) => {
  const { data, error } = await supabase
    .from("leave_request_history")
    .select(
      "history_id,request_id, users(user_id, full_name),changed_at,old_data,new_data,change_type,notification_to,is_read"
    )
    .eq("notification_to", user_id)
    .eq("is_read", false)
    .order("changed_at", { ascending: true });

  if (error) return { success: false, error: error };
  const formattedData: LeaveRequestHistory[] = data.map((item) => ({
    history_id: item.history_id,
    request_id: item.request_id,
    users: item.users[0] || item.users,
    changed_at: item.changed_at,
    old_data: item.old_data,
    new_data: item.new_data,
    change_type: item.change_type,
    notification_to: item.notification_to,
    is_read: item.is_read,
  }));
  return { success: true, data: formattedData };
};
