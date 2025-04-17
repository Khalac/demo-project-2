import { supabase } from "@/utils";

export const setUpdateNoti = async (history_id: string) => {
  const { error } = await supabase
    .from("leave_request_history")
    .update({ is_noti: true })
    .eq("history_id", history_id);

  if (error) {
    return { success: false, error };
  }

  return { success: true, data: null };
};
