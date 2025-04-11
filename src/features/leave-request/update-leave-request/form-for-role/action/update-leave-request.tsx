import { supabase } from "@/utils";
import type { ListleaveRequest } from "@/features/leave-request/list-leave-request";
export const updateLeaveRequest = async (
  value: ListleaveRequest,
  request_id: string,
  updated_at?: Date
) => {
  const { data, error } = await supabase
    .from("leave_request")
    .update({
      start_date: value.start_date,
      end_date: value.end_date,
      total_leave_days: value.total_leave_days,
      total_leave_hours: value.total_leave_hours,
      reason: value.reason,
      status: value.status,
      updated_at: updated_at || null,
      rejected_reason: value.rejected_reason,
    })
    .eq("request_id", request_id);

  if (error) return { success: false, error: error };
  return { success: true, data: data };
};
