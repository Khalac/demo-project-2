import { supabase } from "@/utils";

export const listenUserUpdateAvatar = (userUpdateImage: () => void) => {
  const avatar = supabase.channel("update-avatar");
  avatar
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "users",
      },
      () => {
        userUpdateImage();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(avatar);
  };
};
