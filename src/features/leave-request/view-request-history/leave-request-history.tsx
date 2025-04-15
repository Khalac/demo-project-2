import type { ListleaveRequest } from "../list-leave-request";
import { useEffect, useState } from "react";
import { getRequestHistory, listenRequestHistoryTable } from "./action";
import type { LeaveRequestHistory } from "./leave-request-history-data-type";
import { LoadingSpinner } from "@/components";
import groupHistoryByDate from "./action/group-history-by-date";
import type { HistoryGroup } from "./action/group-history-by-date";
import { useAppSelector } from "@/hook/redux-hook";
enum field {
  start_date = "Start Date",
  end_date = "End Date",
  total_leave_days = "Total Leave Days",
  total_leave_hours = "Total Leave Hours",
  reason = "Reason",
  rejected_reason = "Rejected Reason",
  status = "Status",
}
const LeaveRequestHistory = ({ rowValue }: { rowValue: ListleaveRequest }) => {
  const user = useAppSelector((state) => state.user.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();
  const [data, setData] = useState<HistoryGroup[]>([]);
  const leaveRequestHistory = async () => {
    setLoading(true);
    const res = await getRequestHistory(rowValue.request_id!);
    if (!res.success) {
      setError(res.error);
      setLoading(false);
    }
    console.log(res.data);
    setLoading(false);
    setData(groupHistoryByDate(res.data!));
  };
  useEffect(() => {
    leaveRequestHistory();
    const unsubscribe = listenRequestHistoryTable(leaveRequestHistory);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      {loading ? (
        <LoadingSpinner className="m-auto" />
      ) : data.length === 0 ? (
        <div>No data found</div>
      ) : (
        data.map((res) => {
          return (
            <div>
              <div className="flex items-center w-full my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <div className="px-4 text-gray-600 text-sm font-light">
                  {res.date}
                </div>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              {res.records.map((change) => {
                return (
                  <div>
                    <span className="font-bold">
                      {user.user_id === change.userChange.user_id ? (
                        <>You</>
                      ) : (
                        change.userChange.full_name
                      )}{" "}
                    </span>
                    changed {field[change.key as keyof typeof field]} from{" "}
                    {change.oldValue} to {change.newValue}
                  </div>
                );
              })}
            </div>
          );
        })
      )}
    </div>
  );
};

export default LeaveRequestHistory;
