import { supabase } from "@/utils";
import type { ListleaveRequest } from "@/features/leave-request/list-leave-request";

export const bulkUpdateLeaveRequest = async (values: ListleaveRequest[]) => {
  const { data, error } = await supabase.from("leave_request").upsert(values, {
    onConflict: "request_id",
  });

  if (error) return { success: false, error };
  return { success: true, data };
};
