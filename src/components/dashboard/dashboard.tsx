import { CreateLeaveRequest, UserLeaveDetail } from "@/features/leave-request";
import { ListLeaveRequest } from "@/features/leave-request/list-leave-request";
import UpdateLeaveRequest from "@/features/leave-request/update-leave-request/update-leave-request";
import { useState } from "react";
import type { ListleaveRequest } from "@/features/leave-request/list-leave-request";

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [rowValue, setRowValue] = useState<ListleaveRequest>(
    {} as ListleaveRequest
  );
  return (
    <div>
      <UserLeaveDetail setOpen={setOpen} />
      <CreateLeaveRequest open={open} setOpen={setOpen} />
      <ListLeaveRequest
        setOpenUpdate={setOpenUpdate}
        setRowValue={setRowValue}
      />
      <UpdateLeaveRequest
        open={openUpdate}
        setOpen={setOpenUpdate}
        rowValue={rowValue}
      />
    </div>
  );
};

export default Dashboard;
