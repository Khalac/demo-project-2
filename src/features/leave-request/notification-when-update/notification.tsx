import { useEffect, useState } from "react";
import { getUpdateUnread, setUpdateRead } from "./action";
import { listenRequestHistoryTable } from "../view-request-history/action";
import {
  groupHistoryByDate,
  HistoryGroup,
} from "../view-request-history/action";
import { useAppSelector } from "@/hook/redux-hook";
import { toast } from "sonner";
import type { ListleaveRequest } from "../list-leave-request";
import getLeaveRequestInformation from "./action/get-leave-request-information";
import { LoadingSpinner } from "@/components";

enum field {
  start_date = "Start Date",
  end_date = "End Date",
  total_leave_days = "Total Leave Days",
  total_leave_hours = "Total Leave Hours",
  reason = "Reason",
  rejected_reason = "Rejected Reason",
  status = "Status",
}

export const notification = (
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setRowValue: React.Dispatch<React.SetStateAction<ListleaveRequest>>
) => {
  const user = useAppSelector((state) => state.user.user);
  const [loading, setLoading] = useState(false);

  const leaveRequestHistory = async () => {
    const res = await getUpdateUnread(user.user_id);
    if (!res.success) {
      return;
    }
    triggerToast(groupHistoryByDate(res.data!));
  };
  const openLeaveRequest = async (request_id: string) => {
    setLoading(true);
    const data = await getLeaveRequestInformation(request_id);
    if (!data.success) {
      toast.error("Please try again later");
      return;
    }
    setRowValue(data.data!);
    setOpen(true);
    setLoading(false);
  };
  const triggerToast = (data: HistoryGroup[]) => {
    data.forEach((e) => {
      e.records.forEach((r) => {
        const description =
          r.key === "create"
            ? `${r.userChange.full_name} create new leave request`
            : `${r.userChange.full_name} update ${
                field[r.key as keyof typeof field]
              } from ${r.oldValue} to ${r.newValue}`;

        toast.info("Leave request update", {
          description,
          action: {
            label: loading ? (
              <LoadingSpinner className="" />
            ) : (
              "Open leave request"
            ),
            onClick: () => openLeaveRequest(r.requestId),
          },
        });

        setUpdateRead(r.historyId);
      });
    });
  };

  useEffect(() => {
    leaveRequestHistory();
    const unsubscribe = listenRequestHistoryTable(leaveRequestHistory);
    return () => {
      unsubscribe();
    };
  }, []);
};
