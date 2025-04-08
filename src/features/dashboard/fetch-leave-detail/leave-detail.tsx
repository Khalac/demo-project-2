import { supabase } from "@/utils";
import { useEffect, useState } from "react";

type LeaveDetail = {
  total_leaves: number;
  total_used_leaves: number;
};

const LeaveDetail = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LeaveDetail>();
  const fect = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leave_details")
      .select("total_leaves,total_used_leaves");
    if (error) console.log(error);
    if (data) {
      setLoading(false);
      setData(data[0]);
    }
  };
  useEffect(() => {
    fect();
  }, [data]);
  return (
    <div className="inline-flex flex-col gap-5 bg-white p-5">
      <div className="font-bold text-2xl"> Annual leaves</div>
      <div className="flex gap-5">
        <div className="flex gap-5 bg-[#D1FAE5] p-5 text-[#064E3B] font-bold">
          Available leaves: {data?.total_leaves! - data?.total_used_leaves!}
        </div>

        <div className="flex gap-5 bg-[#FFE3E3] text-[#B91C1C] p-5 font-bold">
          <div>Used leaves: {data?.total_used_leaves!} </div>
        </div>
      </div>
      <button className="bg-[#3A5FBE] text-white p-2 cursor-pointer">
        Create new request
      </button>
    </div>
  );
};

export default LeaveDetail;
