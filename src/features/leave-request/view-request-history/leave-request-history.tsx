import type { ListleaveRequest } from "../list-leave-request";
import { useEffect, useState } from "react";
import {
  getRequestHistory,
  listenRequestHistoryTable,
  groupHistoryByDate,
} from "./action";
import { Skeleton } from "@/components";
import type { HistoryGroup } from "./action/group-history-by-date";
import { useAppSelector } from "@/hook/redux-hook";
import { toast } from "sonner";
import { Separator } from "@/components";

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
  const [data, setData] = useState<HistoryGroup[]>([]);
  const leaveRequestHistory = async () => {
    setLoading(true);
    const res = await getRequestHistory(rowValue.request_id!);

    if (!res.success) {
      toast.error(res.error?.message);
      setLoading(false);
    }
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
        <div className="space-y-2 flex flex-col justify-center items-center">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
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
              <div className="flex flex-col gap-4 pt-1">
                {res.records.map((change, index) => {
                  return (
                    <>
                      <div className="flex flex-col cursor-pointer text-sm sm:text-xs py-2">
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
                        <div className="text-gray-600 text-xs">
                          {change.atTime}
                        </div>
                      </div>
                      {index !== res.records.length - 1 && <Separator />}
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

export default LeaveRequestHistory;
