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
    setData(data.data![0]);
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
    <div className="flex justify-start gap-10 items-center">
      <div className="flex justify-start w-1/6 gap-3 items-center bg-white py-6 rounded-lg px-8">
        <div className="w-5 text-3xl h-5 flex justify-center items-center text-[#566cdb] p-8 bg-[#eff1ff] rounded-lg">
          {loading ? (
            <Skeleton className="h-4 w-full" />
          ) : (
            data?.total_leaves! - data?.total_used_leaves!
          )}
        </div>
        <div className="text-lg">Available leaves</div>
      </div>

      <div className="flex justify-start w-1/6 gap-3 items-center bg-white py-6 rounded-lg px-8">
        <div className="w-5 text-3xl h-5 flex justify-center items-center text-[#B91C1C] p-8 bg-[#FFE3E3] rounded-lg">
          {loading ? (
            <Skeleton className="h-4 w-full" />
          ) : (
            data?.total_used_leaves!
          )}
        </div>
        <div className="text-lg"> Used leaves</div>
      </div>

      <div className="flex justify-start w-1/6 gap-3 items-center bg-white py-6 rounded-lg px-8">
        <div className="w-5 text-3xl h-5 flex justify-center items-center text-[#fba323] p-8 bg-[#fff4e6] rounded-lg">
          {loading ? (
            <Skeleton className="h-4 w-full" />
          ) : (
            data?.total_waiting_leaves!
          )}
        </div>
        <div className="text-lg"> Waiting leaves</div>
      </div>
    </div>
  );
};

export default UserLeaveDetail;
