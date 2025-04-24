import { supabase } from "@/utils";

const updateUserAvatar = async (avatarUrl: string, id: string) => {
  const { error } = await supabase
    .from("users")
    .update({ avatar_url: avatarUrl })
    .eq("user_id", id);

  if (error) return { success: false, error: error };
  return { success: true, data: null };
};

export default updateUserAvatar;
