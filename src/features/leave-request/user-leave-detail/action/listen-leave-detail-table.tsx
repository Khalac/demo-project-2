import { supabase } from "@/utils";

export const listenToLeaveDetailTable = (getUserLeaveDetail: () => void) => {
  const channel = supabase.channel("user-leave-detail");
  channel
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "leave_details",
      },
      (payload) => getUserLeaveDetail()
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
