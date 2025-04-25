import { useEffect, useState } from "react";
import { Skeleton } from "@/components";
import { getLeaveDetail, listenToLeaveDetailTable } from "./action";
import { useAppSelector } from "@/hook/redux-hook";

type UserLeaveDetail = {
  total_leaves: number;
  total_used_leaves: number;
  total_waiting_leaves: number;
};

const UserLeaveDetail = () => {
  const user = useAppSelector((state) => state.user.user);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserLeaveDetail>();
  const getUserLeaveDetail = async () => {
    setLoading(true);
    const data = await getLeaveDetail(user.user_id);
    if (!data.success) {
      setLoading(false);
    }
    setData(data.data!);
    setLoading(false);
  };
  useEffect(() => {
    getUserLeaveDetail();
    const unsubscribe = listenToLeaveDetailTable(getUserLeaveDetail);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-10 items-center">
      <div className="flex justify-start  w-fit sm:gap-3 gap-2 items-center bg-white sm:py-6 py-3 rounded-lg sm:px-8 px-4">
        <div className="sm:w-5 w-2 h-2 sm:text-3xl text-sm sm:h-5 flex justify-center items-center text-[#566cdb] sm:p-8 p-5 bg-[#eff1ff] rounded-lg">
          {loading ? (
            <Skeleton className="h-4 w-full" />
          ) : (
            data?.total_leaves! - data?.total_used_leaves!
          )}
        </div>
        <div className="sm:text-lg text-xs ">Available leaves</div>
      </div>

      <div className="flex justify-start w-fit sm:gap-3 gap-2 items-center bg-white sm:py-6 py-3 rounded-lg sm:px-8 px-4">
        <div className="sm:w-5 w-2 h-2 sm:text-3xl text-sm sm:h-5 flex justify-center items-center text-[#B91C1C] sm:p-8 p-5 bg-[#FFE3E3] rounded-lg">
          {loading ? (
            <Skeleton className="h-4 w-full" />
          ) : (
            data?.total_used_leaves!
          )}
        </div>
        <div className="sm:text-lg text-xs "> Used leaves</div>
      </div>

      <div className="flex justify-start w-fit sm:gap-3 gap-2 items-center bg-white sm:py-6 py-3 rounded-lg sm:px-8 px-4">
        <div className="sm:w-5 w-2 h-2 sm:text-3xl text-sm sm:h-5 flex justify-center items-center text-[#fba323] sm:p-8 p-5 bg-[#fff4e6] rounded-lg">
          {loading ? (
            <Skeleton className="h-4 w-full" />
          ) : (
            data?.total_waiting_leaves!
          )}
        </div>
        <div className="sm:text-lg text-xs "> Waiting leaves</div>
      </div>
    </div>
  );
};

export default UserLeaveDetail;
