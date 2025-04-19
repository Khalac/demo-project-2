import { supabase } from "@/utils";
export const getListLeaveRequestEachManager = async (id: string) => {
  const { data, error } = await supabase
    .from("leave_request")
    .select(
      "request_id,user_id,start_date, end_date, total_leave_days,total_leave_hours,reason,status,rejected_reason, users!leave_request_user_id_fkey(full_name, email),manager:users!leave_request_manager_id_fkey(full_name, email)"
    )
    .eq("manager_id", id);

  if (error) return { success: false, error: error };
  return { success: true, data: data };
};
