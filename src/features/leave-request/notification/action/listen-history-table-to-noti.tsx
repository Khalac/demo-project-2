import { supabase } from "@/utils";

export const listenHistoryTableToNoti = (leaveRequestHistory: () => void) => {
  const channel = supabase.channel("notification");

  channel
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "leave_request_history",
      },
      () => leaveRequestHistory()
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
