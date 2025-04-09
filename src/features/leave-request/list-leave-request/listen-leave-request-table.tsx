import { supabase } from "@/utils";

export const listenToLeaveRequestTable = (userListLeaveRequest: () => void) => {
  const channel = supabase.channel("user-leave-request");
  channel
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "leave_request",
      },
      (payload) => userListLeaveRequest()
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
