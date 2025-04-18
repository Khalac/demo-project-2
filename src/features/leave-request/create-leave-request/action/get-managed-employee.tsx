import { supabase } from "@/utils";
export type ListEmployee = {
  user_id: string;
  full_name: string;
};
export const getManagedEmployee = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("user_id,full_name");

  if (error) return { success: false, error: error };
  return { success: true, data: data as ListEmployee[] };
};
