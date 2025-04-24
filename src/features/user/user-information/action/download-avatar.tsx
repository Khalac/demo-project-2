import { supabase } from "@/utils";

export const downloadAvatar = async (path: string) => {
  const { data } = await supabase.storage.from("avatars").getPublicUrl(path);

  if (!data.publicUrl) return { success: false };
  return { success: true, data: data.publicUrl };
};
