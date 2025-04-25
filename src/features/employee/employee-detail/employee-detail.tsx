import {
  Input,
  Label,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui";
import { EmployeeDetailContext } from "@/context";
import { useAppSelector } from "@/hook/redux-hook";
import { useContext } from "react";
const EmployeeDetail = () => {
  const user = useAppSelector((state) => state.user.user);
  const { openDetail, setOpenDetail, rowValueDetail } = useContext(
    EmployeeDetailContext
  );

  return (
    <Sheet open={openDetail} onOpenChange={setOpenDetail}>
      <SheetContent className="min-w-[100vw] sm:min-w-[20vw]">
        <SheetHeader>
          <SheetTitle>Employee detail</SheetTitle>
        </SheetHeader>
        <div className="h-full w-full flex flex-col gap-10 p-10">
          <div className="flex flex-col gap-2">
            <Label>Full name</Label>
            <Input disabled value={rowValueDetail.full_name} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Email</Label>
            <Input disabled value={rowValueDetail.email} />
          </div>
          {user.role === "HR" && (
            <>
              <div className="flex flex-col gap-2">
                <Label>Manager full name</Label>
                <Input disabled value={rowValueDetail.manager?.full_name} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Manager email</Label>
                <Input disabled value={rowValueDetail.manager?.email} />
              </div>
            </>
          )}
          <div className="flex flex-col gap-2">
            <Label>Onboard date</Label>
            <Input disabled value={String(rowValueDetail.onboard_date)} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EmployeeDetail;
