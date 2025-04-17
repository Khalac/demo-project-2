import { supabase } from "@/utils";

export const setUpdateRead = async (history_id: string) => {
  const { error } = await supabase
    .from("leave_request_history")
    .update({ is_read: true })
    .eq("history_id", history_id);

  if (error) {
    return { success: false, error };
  }
  return { success: true, data: null };
};
