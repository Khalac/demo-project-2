import { supabase } from "@/utils";
export const getManager = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("user_id,full_name")
    .eq("role", "MANAGER");

  if (error) return { success: false, error: error };
  return { success: true, data: data };
};
