import { supabase } from "@/utils";

const createNewLeaveRequest = async (
  start_date: Date,
  end_date: Date,
  total_leave_days: number,
  total_leave_hours: number,
  reason: string
) => {
  const { error } = await supabase.from("leave_request").insert({
    start_date: start_date,
    end_date: end_date,
    total_leave_days: total_leave_days,
    total_leave_hours: total_leave_hours,
    reason: reason,
  });
  if (error) return { success: false, error: error };

  return { success: true, data: null };
};

export default createNewLeaveRequest;
