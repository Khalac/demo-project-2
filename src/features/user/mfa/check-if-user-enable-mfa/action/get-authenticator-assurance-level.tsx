import { supabase } from "@/utils";

export const getAuthenticatorAssuranceLevel = async () => {
  const { data, error } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, data: data };
};
