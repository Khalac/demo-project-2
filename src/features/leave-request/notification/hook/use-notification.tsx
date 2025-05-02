import { useEffect, useState } from "react";
import {
  listenHistoryTableToNoti,
  getLeaveRequestInformation,
  getUpdateUnnoti,
  setUpdateNoti,
  setUpdateRead,
} from "../action";
import {
  groupHistoryByDate,
  HistoryGroup,
} from "../../view-request-history/action";
import { useAppSelector } from "@/hook/redux-hook";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components";
import { useContext } from "react";
import { UpdateLeaveRequestContext } from "../../update-leave-request/model";
enum field {
  start_date = "Start Date",
  end_date = "End Date",
  total_leave_days = "Total Leave Days",
  total_leave_hours = "Total Leave Hours",
  reason = "Reason",
  rejected_reason = "Rejected Reason",
  status = "Status",
}

export const useNotification = () => {
  const { setOpenUpdate, setRowValue } = useContext(UpdateLeaveRequestContext);
  const user = useAppSelector((state) => state.user.user);
  const [loading, setLoading] = useState(false);

  const getUpdateToTrigger = async () => {
    const res = await getUpdateUnnoti(user.user_id);
    if (!res.success) {
      return;
    }
    triggerToast(groupHistoryByDate(res.data!));
  };
  const openLeaveRequest = async (request_id: string, history_id: string) => {
    setLoading(true);
    const res = await setUpdateRead(history_id);
    if (!res.success) {
      toast.error("Please try again later");
      return;
    }
    const data = await getLeaveRequestInformation(request_id);
    if (!data.success) {
      toast.error("Please try again later");
      return;
    }
    setLoading(false);
    setRowValue(data.data!);
    setOpenUpdate(true);
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
            onClick: () => openLeaveRequest(r.requestId, r.historyId),
          },
        });

        setUpdateNoti(r.historyId);
      });
    });
  };

  useEffect(() => {
    getUpdateToTrigger();
    const unsubscribe = listenHistoryTableToNoti(getUpdateToTrigger);
    return () => {
      unsubscribe();
    };
  }, [user.user_id]);
};
