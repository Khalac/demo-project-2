import { ListNotification } from "@/features/leave-request";
import { UpdateLeaveRequest } from "@/features/leave-request";
const Notification = () => {
  return (
    <div>
      <ListNotification />
      <UpdateLeaveRequest />
    </div>
  );
};

export default Notification;
