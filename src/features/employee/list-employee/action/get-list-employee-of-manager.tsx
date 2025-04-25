import { supabase } from "@/utils";
import type { ListEmployeeType } from "../model/list-employee-type";
export const getListEmployeeOfManager = async (id: string) => {
  const { data, error } = await supabase
    .from("users")
    .select(
      "user_id,manager:manager_id(full_name,email),email,full_name,onboard_date,role"
    )
    .eq("manager_id", id);

  if (error) return { success: false, error: error };
  const formattedData: ListEmployeeType[] = data.map((item) => ({
    user_id: item.user_id,
    manager: Array.isArray(item.manager)
      ? item.manager[0]
      : item.manager || null,
    email: item.email,
    full_name: item.full_name,
    onboard_date: item.onboard_date,
    role: item.role,
  }));
  return { success: true, data: formattedData };
};
