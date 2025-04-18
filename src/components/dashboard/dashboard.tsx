import { CreateLeaveRequest, UserLeaveDetail } from "@/features/leave-request";
import {
  ListLeaveRequest,
  ListLeaveRequestHR,
} from "@/features/leave-request/list-leave-request";
import UpdateLeaveRequest from "@/features/leave-request/update-leave-request/update-leave-request";
import { useAppSelector } from "@/hook/redux-hook";
import { useNotification } from "@/features/leave-request/notification";

const Dashboard = () => {
  const user = useAppSelector((state) => state.user.user);
  useNotification();
  return (
    <div>
      {user.role !== "HR" && (
        <>
          <UserLeaveDetail />
          <ListLeaveRequest />
        </>
      )}
      <CreateLeaveRequest />
      <UpdateLeaveRequest />
      {user.role === "HR" && <ListLeaveRequestHR />}
    </div>
  );
};

export default Dashboard;
