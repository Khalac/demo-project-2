import { supabase } from "@/utils";

export const listenUserUpdateAvatarSmall = (userUpdateImage: () => void) => {
  const avatar = supabase.channel("update-avatar-small");
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
