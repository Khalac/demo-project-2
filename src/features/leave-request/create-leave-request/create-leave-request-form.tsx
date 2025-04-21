import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui";
import { memo } from "react";
import { useContext } from "react";
import { CreateLeaveRequestContext } from "@/context";
import { EmployeeForm, ManagerForm } from "./form-for-role";
import { useAppSelector } from "@/hook/redux-hook";

const roles = ["EMPLOYEE", "MANAGER"] as const;

type Role = (typeof roles)[number];

type FormComponentProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type FormComponentMap = Record<Role, React.ComponentType<FormComponentProps>>;

const CreateLeaveRequest = () => {
  const { open, setOpen } = useContext(CreateLeaveRequestContext);
  const user = useAppSelector((state) => state.user.user);

  const formComponents: FormComponentMap = {
    EMPLOYEE: EmployeeForm,
    MANAGER: ManagerForm,
  };
  const FormComponent = formComponents[user.role as Role];
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="min-w-[30vw]">
        <SheetHeader>
          <SheetTitle>Create request</SheetTitle>
        </SheetHeader>
        <FormComponent setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  );
};
export default memo(CreateLeaveRequest);
