import { supabase } from "@/utils";

export const listenRequestHistoryTable = (leaveRequestHistory: () => void) => {
  const channel = supabase.channel("user-leave-request-history");
  channel
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "leave_request",
      },
      (payload) => leaveRequestHistory()
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
