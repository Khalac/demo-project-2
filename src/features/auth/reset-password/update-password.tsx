import { supabase } from "@/utils";

const updatePassword = async (password: string) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) return { success: false, error: error.message };

    if (data) return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error };
  }
};

export default updatePassword;
