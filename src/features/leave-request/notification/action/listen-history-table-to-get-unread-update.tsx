import { supabase } from "@/utils";

export const listenHistoryTableToGetUnreadUpdate = (
  leaveRequestHistory: () => void
) => {
  const channel = supabase.channel("unread-update");

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
