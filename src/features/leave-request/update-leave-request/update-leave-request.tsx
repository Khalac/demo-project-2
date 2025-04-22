import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import type { ListleaveRequest } from "../list-leave-request";
import { EmployeeForm, HRForm, ManagerForm } from "./form-for-role";
import { useAppSelector } from "@/hook/redux-hook";
import LeaveRequestHistory from "../view-request-history/leave-request-history";
import { useContext } from "react";
import { UpdateLeaveRequestContext } from "@/context";

const roles = ["EMPLOYEE", "HR", "MANAGER"] as const;

type Role = (typeof roles)[number];

type FormComponentProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rowValue: ListleaveRequest;
};

type FormComponentMap = Record<Role, React.ComponentType<FormComponentProps>>;

const UpdateLeaveRequest = () => {
  const { openUpdate, setOpenUpdate, rowValue } = useContext(
    UpdateLeaveRequestContext
  );
  const user = useAppSelector((state) => state.user.user);

  const formComponents: FormComponentMap = {
    EMPLOYEE: EmployeeForm,
    HR: HRForm,
    MANAGER: ManagerForm,
  };
  const FormComponent = formComponents[user.role as Role];

  return (
    <Sheet open={openUpdate} onOpenChange={setOpenUpdate}>
      <SheetContent className="min-w-[30vw]">
        <SheetHeader>
          <SheetTitle>Leave request</SheetTitle>
        </SheetHeader>
        <Tabs defaultValue="information">
          <TabsList className="mx-auto">
            <TabsTrigger value="information">Information</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="information">
            <div className="p-5 flex flex-col gap-5">
              <FormComponent rowValue={rowValue} setOpen={setOpenUpdate} />
            </div>
          </TabsContent>
          <TabsContent value="history">
            <div className="p-5 flex flex-col gap-5">
              <LeaveRequestHistory rowValue={rowValue} />
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default UpdateLeaveRequest;
