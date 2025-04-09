import { CreateLeaveRequest, UserLeaveDetail } from "@/features/leave-request";
import { ListLeaveRequest } from "@/features/leave-request/list-leave-request";
import { useState } from "react";

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <UserLeaveDetail setOpen={setOpen} />
      <CreateLeaveRequest open={open} setOpen={setOpen} />
      <ListLeaveRequest />
    </div>
  );
};

export default Dashboard;
