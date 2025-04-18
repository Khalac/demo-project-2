import { supabase } from "@/utils";

export const createNewLeaveRequest = async (
  start_date: Date,
  end_date: Date,
  total_leave_days: number,
  total_leave_hours: number,
  reason: string,
  user_id?: string
) => {
  const payload = {
    start_date: start_date,
    end_date: end_date,
    total_leave_days: total_leave_days,
    total_leave_hours: total_leave_hours,
    reason: reason,
    ...(user_id && { user_id: user_id, status: "APPROVED" }),
  };
  const { error } = await supabase.from("leave_request").insert(payload);
  if (error) return { success: false, error: error };

  return { success: true, data: null };
};
