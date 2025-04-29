import { useEffect, useState } from "react";
import { groupHistoryByDate } from "../../view-request-history/action";
import type { HistoryGroup } from "../../view-request-history/action";
import { useAppSelector } from "@/hook/redux-hook";
import {
  listenHistoryTableToUpdateNotificationPage,
  getAllHistory,
} from "./action";
import { useContext } from "react";
import { UpdateLeaveRequestContext } from "../../update-leave-request/model";
import { setUpdateRead, getLeaveRequestInformation } from "../action";
import { toast } from "sonner";
import { Skeleton } from "@/components";
import { cn } from "@/lib";

enum field {
  start_date = "Start Date",
  end_date = "End Date",
  total_leave_days = "Total Leave Days",
  total_leave_hours = "Total Leave Hours",
  reason = "Reason",
  rejected_reason = "Rejected Reason",
  status = "Status",
}
const ListNotification = () => {
  const { setOpenUpdate, setRowValue } = useContext(UpdateLeaveRequestContext);
  const user = useAppSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<HistoryGroup[]>([]);

  const getUpdateToTrigger = async () => {
    const res = await getAllHistory(user.user_id);
    if (!res.success) {
      toast.error(res.error?.message);
      setLoading(false);
    }
    setLoading(false);
    setData(groupHistoryByDate(res.data!));
  };
  const openLeaveRequest = async (request_id: string, history_id: string) => {
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

    setRowValue(data.data!);
    setOpenUpdate(true);
  };
  useEffect(() => {
    getUpdateToTrigger();
    const unsubscribe =
      listenHistoryTableToUpdateNotificationPage(getUpdateToTrigger);
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <div className="flex justify-start items-center flex-col h-full w-full gap-10 scroll-auto px-2 md:px-0">
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-5 w-[350px]" />
          <Skeleton className="h-5 w-[250px]" />
          <Skeleton className="h-5 w-[300px]" />
        </div>
      ) : !loading && data.length === 0 ? (
        <div>No data found</div>
      ) : (
        data.map((res) => {
          return (
            <div className="bg-white sm:p-10 p-5 rounded-2xl sm:w-1/2 w-full">
              <div className="flex items-center w-full">
                <div className="flex-grow border-t border-gray-300"></div>
                <div className="px-4 text-gray-600 text-sm font-light">
                  {res.date}
                </div>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              <div className="flex flex-col gap-4 pt-2">
                {res.records.map((change) => {
                  return (
                    <>
                      <div
                        className={cn(
                          "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 cursor-pointer text-sm text-gray-800 shadow-sm p-4 rounded-lg",
                          !change.isRead
                            ? "bg-gray-200 hover:bg-gray-300"
                            : "bg-white hover:bg-gray-50"
                        )}
                        onClick={() =>
                          openLeaveRequest(change.requestId, change.historyId)
                        }
                      >
                        <div className="">
                          <span className="font-bold">
                            {user.user_id === change.userChange.user_id ? (
                              <>You</>
                            ) : (
                              change.userChange.full_name
                            )}{" "}
                          </span>
                          {change.key === "create" ? (
                            <span className="text-gray-600">
                              have create a new leave request
                            </span>
                          ) : (
                            <span className="text-gray-600">
                              changed {field[change.key as keyof typeof field]}{" "}
                              from {change.oldValue} to {change.newValue}
                            </span>
                          )}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {change.atTime}
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ListNotification;
