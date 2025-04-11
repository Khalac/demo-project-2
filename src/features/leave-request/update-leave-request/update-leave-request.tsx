import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui";
import type { ListleaveRequest } from "../list-leave-request";
import EmployeeForm from "./form-for-role/employee-form";
import { useAppSelector } from "@/hook/redux-hook";
import HRForm from "./form-for-role/hr-form";
import ManagerForm from "./form-for-role/manager-form";

const UpdateLeaveRequest = ({
  open,
  setOpen,
  rowValue,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rowValue: ListleaveRequest;
}) => {
  const user = useAppSelector((state) => state.user.user);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Leave request</SheetTitle>
        </SheetHeader>
        <div className="p-5 flex flex-col gap-5">
          {user.role === "Employee" ? (
            <EmployeeForm setOpen={setOpen} rowValue={rowValue} />
          ) : user.role === "HR" ? (
            <HRForm setOpen={setOpen} rowValue={rowValue} />
          ) : (
            <ManagerForm setOpen={setOpen} rowValue={rowValue} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UpdateLeaveRequest;
