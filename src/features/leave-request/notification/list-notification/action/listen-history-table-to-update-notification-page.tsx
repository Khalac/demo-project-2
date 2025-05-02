import { supabase } from "@/utils";

export const listenHistoryTableToUpdateNotificationPage = (
  leaveRequestHistory: () => void
) => {
  const channel = supabase.channel("notification-list");

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
