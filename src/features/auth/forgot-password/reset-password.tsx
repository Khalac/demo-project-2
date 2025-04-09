import { supabase } from "@/utils";

const resetPassword = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/reset-password",
    });
    if (error) return { success: false, error: error };
    if (data) return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error };
  }
};

export default resetPassword;
