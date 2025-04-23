import { ListEmployeeManager } from "@/features/employee/list-employee";
import EmployeeDetail from "@/features/employee/employee-detail/employee-detail";
import { useAppSelector } from "@/hook/redux-hook";
import ListEmployeeHR from "@/features/employee/list-employee/list-employee-hr";

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
