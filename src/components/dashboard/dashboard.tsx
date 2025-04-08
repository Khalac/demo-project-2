import { CreateLeaveRequest } from "@/features/create-leave-request";
import { LeaveDetail } from "@/features/fetch-leave-detail";
import { useState } from "react";

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <LeaveDetail setOpen={setOpen} />
      <CreateLeaveRequest open={open} setOpen={setOpen} />
    </div>
  );
};

export default Dashboard;
