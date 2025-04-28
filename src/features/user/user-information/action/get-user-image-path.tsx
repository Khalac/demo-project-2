import { supabase } from "@/utils";
export const getUserImagePath = async (id: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("avatar_url")
    .eq("user_id", id)
    .single();

  if (error) return { success: false, error: error };
  return { success: true, data: data };
};
