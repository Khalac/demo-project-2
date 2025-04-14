import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui";
import type { ListleaveRequest } from "../list-leave-request";
import { EmployeeForm, HRForm, ManagerForm } from "./form-for-role";
import { useAppSelector } from "@/hook/redux-hook";

const roles = ["EMPLOYEE", "HR", "MANAGER"] as const;

type Role = (typeof roles)[number];

type FormComponentProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rowValue: ListleaveRequest;
};

type FormComponentMap = Record<Role, React.ComponentType<FormComponentProps>>;

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

  const formComponents: FormComponentMap = {
    EMPLOYEE: EmployeeForm,
    HR: HRForm,
    MANAGER: ManagerForm,
  };
  const FormComponent = formComponents[user.role as Role];
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Leave request</SheetTitle>
        </SheetHeader>
        <div className="p-5 flex flex-col gap-5">
          <FormComponent rowValue={rowValue} setOpen={setOpen} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UpdateLeaveRequest;
