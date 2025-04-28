import { supabase } from "@/utils";

export const getListFactors = async () => {
  const factors = await supabase.auth.mfa.listFactors();
  if (factors.error) return { success: false, error: factors.error.message };
  return { success: true, data: factors.data };
};
