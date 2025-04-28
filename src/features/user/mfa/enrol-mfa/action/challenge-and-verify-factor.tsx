import { supabase } from "@/utils";

export const challengeAndVerifyFactor = async (
  factorId: string,
  code: string
) => {
  const data = await supabase.auth.mfa.challengeAndVerify({
    factorId,
    code,
  });

  if (data.error) return { success: false, error: data.error.message };

  return { success: true, data: data.data };
};
