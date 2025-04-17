import { useEffect, useState } from "react";
import { groupHistoryByDate } from "../view-request-history/action";
import { LoadingSpinner } from "@/components";
import type { HistoryGroup } from "../view-request-history/action";
import { useAppSelector } from "@/hook/redux-hook";
import { getAllHistory } from "./action";
import { listenHistoryTableToUpdateNotificationPage } from "./action/listen-history-table-to-update-notification-page";
import { useContext } from "react";
import { UpdateLeaveRequestContext } from "@/context";
import { setUpdateRead, getLeaveRequestInformation } from "./action";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
  const navigate = useNavigate();
  const { setOpenUpdate, setRowValue } = useContext(UpdateLeaveRequestContext);
  const user = useAppSelector((state) => state.user.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();
  const [data, setData] = useState<HistoryGroup[]>([]);

  const getUpdateToTrigger = async () => {
    const res = await getAllHistory(user.user_id);
    if (!res.success) {
      setError(res.error);
      setLoading(false);
    }
    setLoading(false);
    setData(groupHistoryByDate(res.data!));
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
    navigate("/");
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
    <div className="flex justify-start items-center flex-col h-full w-full gap-10 scroll-auto">
      {loading ? (
        <LoadingSpinner className="m-auto" />
      ) : data.length === 0 ? (
        <div>No data found</div>
      ) : (
        data.map((res) => {
          return (
            <div className="bg-white p-10 rounded-2xl w-1/2">
              <div className="flex items-center w-full">
                <div className="flex-grow border-t border-gray-300"></div>
                <div className="px-4 text-gray-600 text-sm font-light">
                  {res.date}
                </div>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              <div className="flex flex-col gap-4">
                {res.records.map((change) => {
                  return (
                    <div
                      className="flex items-center justify-between bg-gray-100 p-2"
                      onClick={() =>
                        openLeaveRequest(change.requestId, change.historyId)
                      }
                    >
                      <div>
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
                      <div className="text-gray-600">{change.atTime}</div>
                    </div>
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
