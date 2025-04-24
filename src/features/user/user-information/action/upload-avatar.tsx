import { supabase } from "@/utils";

export const uploadAvatar = async (filePath: string, file: any) => {
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file);

  if (uploadError) return { success: false, error: uploadError };
  return { success: true, data: null };
};
