import { supabase } from "@/utils";

export const enrollNewFactor = async () => {
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
  });
  if (error) return { success: false, error: error.message };
  return { success: true, data: data };
};
