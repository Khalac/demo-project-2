import { supabase } from "@/utils";
export const getListLeaveRequest = async () => {
  const { data, error } = await supabase
    .from("leave_request")
    .select(
      "request_id,user_id,start_date, end_date, total_leave_days,total_leave_hours,reason,status,rejected_reason, users!leave_request_user_id_fkey(full_name, email)"
    );

  if (error) return { success: false, error: error };
  return { success: true, data: data };
};
