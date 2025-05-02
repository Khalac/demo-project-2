import { ListNotification, UpdateLeaveRequest } from "@/features/leave-request";
import { UserDetail } from "@/features/user";
const Notification = () => {
  return (
    <div>
      <ListNotification />
      <UpdateLeaveRequest />
      <UserDetail />
    </div>
  );
};

export default Notification;
