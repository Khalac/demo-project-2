import { supabase } from "@/utils";

export async function getLeaveDetail() {
  const { data, error } = await supabase
    .from("leave_details")
    .select("total_leaves,total_used_leaves,total_waiting_leaves");
  if (error) return { success: false, error: error };
  return { success: true, data: data };
}
