import {
  ListEmployeeManager,
  ListEmployeeHR,
} from "@/features/employee/list-employee";
import { EmployeeDetail } from "@/features/employee/employee-detail";
import { useAppSelector } from "@/hook/redux-hook";

const Employee = () => {
  const user = useAppSelector((state) => state.user.user);
  return (
    <div>
      {user.role === "MANAGER" ? <ListEmployeeManager /> : <ListEmployeeHR />}
      <EmployeeDetail />
    </div>
  );
};

export default Employee;
