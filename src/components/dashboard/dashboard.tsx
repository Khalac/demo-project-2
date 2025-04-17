import { CreateLeaveRequest, UserLeaveDetail } from "@/features/leave-request";
import { ListLeaveRequest } from "@/features/leave-request/list-leave-request";
import UpdateLeaveRequest from "@/features/leave-request/update-leave-request/update-leave-request";
import { useAppSelector } from "@/hook/redux-hook";
import { useNotification } from "@/features/leave-request/notification";

const Dashboard = () => {
  const user = useAppSelector((state) => state.user.user);
  useNotification();
  return (
    <div>
      {user.role === "EMPLOYEE" && <UserLeaveDetail />}
      <CreateLeaveRequest />
      <ListLeaveRequest />
      <UpdateLeaveRequest />
    </div>
  );
};

export default Dashboard;
