import {
  CreateLeaveRequest,
  UserLeaveDetail,
  ListLeaveRequest,
  ListLeaveRequestHR,
  UpdateLeaveRequest,
} from "@/features/leave-request";
import { useAppSelector } from "@/hook/redux-hook";
import { UserDetail } from "@/features/user";
import { CheckIfUserEnableMFA } from "@/features/user";

const Dashboard = () => {
  const user = useAppSelector((state) => state.user.user);

  return (
    <div className="flex flex-col w-full p-5">
      <CheckIfUserEnableMFA />
      {user.role === "EMPLOYEE" && (
        <>
          <UserLeaveDetail />
        </>
      )}
      {user.role !== "HR" && (
        <>
          <ListLeaveRequest />
          <CreateLeaveRequest />
        </>
      )}
      <UpdateLeaveRequest />
      {user.role === "HR" && <ListLeaveRequestHR />}
      <UserDetail />
    </div>
  );
};

export default Dashboard;
