import { supabase } from "@/utils";

export const unenrollFactor = async (factorId: string) => {
  const data = await supabase.auth.mfa.unenroll({ factorId });
  if (data.error) return { success: false, error: data.error.message };
  return { success: true, data: null };
};
