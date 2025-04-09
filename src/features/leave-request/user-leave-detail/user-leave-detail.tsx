import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components";
import { getLeaveDetail } from "./get-leave-detail";
import { listenToLeaveDetailTable } from "./listen-leave-detail-table";

type UserLeaveDetail = {
  total_leaves: number;
  total_used_leaves: number;
  total_waiting_leaves: number;
};

const UserLeaveDetail = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserLeaveDetail>();
  const getUserLeaveDetail = async () => {
    setLoading(true);
    const data = await getLeaveDetail();
    if (!data.success) return;
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
    <div className="inline-flex flex-col gap-5 bg-white p-5">
      <div className="font-bold text-2xl"> Annual leaves</div>
      <div className="flex gap-5">
        <div className="flex gap-5 bg-[#D1FAE5] p-5 text-[#064E3B] font-bold">
          Available leaves:{" "}
          {loading ? (
            <LoadingSpinner className="" />
          ) : (
            data?.total_leaves! - data?.total_used_leaves!
          )}
        </div>

        <div className="flex gap-5 bg-[#FFE3E3] text-[#B91C1C] p-5 font-bold">
          <div>
            Used leaves:{" "}
            {loading ? (
              <LoadingSpinner className="" />
            ) : (
              data?.total_used_leaves!
            )}
          </div>
        </div>

        <div className="flex gap-5 bg-[#87a6f5]  p-5 font-bold text-[#113caa]">
          <div>
            Waiting leaves:{" "}
            {loading ? (
              <LoadingSpinner className="" />
            ) : (
              data?.total_waiting_leaves!
            )}
          </div>
        </div>
      </div>
      <button
        className="bg-[#3A5FBE] text-white p-2 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        Create new request
      </button>
    </div>
  );
};

export default UserLeaveDetail;
