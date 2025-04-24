import {
  ListEmployeeManager,
  ListEmployeeHR,
} from "@/features/employee/list-employee";
import { EmployeeDetail } from "@/features/employee/employee-detail";
import { useAppSelector } from "@/hook/redux-hook";
import { UserDetail } from "@/features/user/user-information";

const Employee = () => {
  const user = useAppSelector((state) => state.user.user);
  return (
    <div>
      {user.role === "MANAGER" ? <ListEmployeeManager /> : <ListEmployeeHR />}
      <EmployeeDetail />
      <UserDetail />
    </div>
  );
};

export default Employee;
