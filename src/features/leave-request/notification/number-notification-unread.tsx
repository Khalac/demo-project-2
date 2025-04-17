import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { getUpdateUnread } from "./action";
import { useAppSelector } from "@/hook/redux-hook";
import { groupHistoryByDate } from "../view-request-history/action";
import { listenHistoryTableToGetUnreadUpdate } from "./action";
import { useNavigate } from "react-router-dom";

const NumberNotificationUnread = () => {
  const navigate = useNavigate();
  const [numberOfNotificationUnread, setNumberOfNotificationUnread] =
    useState(0);
  const user = useAppSelector((state) => state.user.user);

  const leaveRequestHistory = async () => {
    const res = await getUpdateUnread(user.user_id);
    if (!res.success) {
      return;
    }
    const total = groupHistoryByDate(res.data!).reduce(
      (total, e) => total + e.records.length,
      0
    );
    setNumberOfNotificationUnread(total);
  };
  useEffect(() => {
    leaveRequestHistory();
    const unsubscribe =
      listenHistoryTableToGetUnreadUpdate(leaveRequestHistory);
    return () => {
      unsubscribe();
    };
  }, []);
  const goToNotificationPage = () => {
    navigate("/notification");
  };
  return (
    <div
      className="relative cursor-pointer"
      onClick={() => goToNotificationPage()}
    >
      <Bell />
      <div className="absolute bg-red-600 text-white w-4 h-4 text-xs font-bold top-[-5px] right-[-2px] rounded-[50%] flex justify-center items-center">
        {numberOfNotificationUnread}
      </div>
    </div>
  );
};

export default NumberNotificationUnread;
