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
import { EmployeeForm, HRForm, ManagerForm } from "./form-for-role";
import { useAppSelector } from "@/hook/redux-hook";
import LeaveRequestHistory from "../view-request-history/leave-request-history";
import { useContext } from "react";
import { UpdateLeaveRequestContext } from "./model";

const roles = ["EMPLOYEE", "HR", "MANAGER"] as const;

type Role = (typeof roles)[number];

type FormComponentProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type FormComponentMap = Record<Role, React.ComponentType<FormComponentProps>>;

const UpdateLeaveRequest = () => {
  const { openUpdate, setOpenUpdate } = useContext(UpdateLeaveRequestContext);
  const user = useAppSelector((state) => state.user.user);

  const formComponents: FormComponentMap = {
    EMPLOYEE: EmployeeForm,
    HR: HRForm,
    MANAGER: ManagerForm,
  };
  const FormComponent = formComponents[user.role as Role];

  return (
    <Sheet open={openUpdate} onOpenChange={setOpenUpdate}>
      <SheetContent className="min-w-[100vw] sm:min-w-[30vw]">
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
              <FormComponent setOpen={setOpenUpdate} />
            </div>
          </TabsContent>
          <TabsContent value="history">
            <div className="px-5 h-[100dvh] overflow-y-auto overflow-x-hidden">
              <LeaveRequestHistory />
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default UpdateLeaveRequest;
