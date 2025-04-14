import {
  Button,
  Input,
  FormLabel,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  LoadingSpinner,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Calendar,
} from "@/components/ui";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { leaveRequestFormSchema } from "../../create-leave-request";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LeaveRequestData } from "../../create-leave-request";
import { toast } from "sonner";
import { useAppSelector } from "@/hook/redux-hook";
import type { ListleaveRequest } from "../../list-leave-request";
import { updateLeaveRequest } from "./action/update-leave-request";
import { convertLocalDateToUTC } from "@/utils";
import { status } from "../../list-leave-request";

const ManagerForm = ({
  setOpen,
  rowValue,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rowValue: ListleaveRequest;
}) => {
  const leaveRequestList = useAppSelector(
    (state) => state.listLeaveRequest.listLeaveRequest
  );
  const filteredLeaveRequestList = leaveRequestList.filter(
    (req) => req.request_id !== rowValue?.request_id
  );
  const [error, setError] = useState<any>();
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [selectRow, setSelectRow] = useState<ListleaveRequest>();

  const form = useForm({
    resolver: zodResolver(leaveRequestFormSchema(filteredLeaveRequestList)),
    mode: "onChange",
  });
  async function onSubmit(values: LeaveRequestData) {
    if (values.status === "APPROVED") setLoadingApprove(true);
    else setLoadingReject(true);
    const utcStartDate = convertLocalDateToUTC(values.start_date);
    const utcEndDate = convertLocalDateToUTC(values.end_date);
    const updated_at = new Date();
    const data = await updateLeaveRequest(
      {
        ...values,
        start_date: utcStartDate,
        end_date: utcEndDate,
        rejected_reason: values.rejected_reason,
        status: values.status,
      },
      selectRow?.request_id!,
      updated_at
    );
    if (!data.success) {
      if (values.status === "APPROVED") setLoadingApprove(false);
      else setLoadingReject(false);
      setError(error);
      return;
    }
    if (values.status === "APPROVED") setLoadingApprove(false);
    else setLoadingReject(false);
    setOpen(false);
    toast.success("Update request successfully");
  }
  useEffect(() => {
    const selectedRow = leaveRequestList.find(
      (lr) => lr.request_id === rowValue.request_id
    );
    if (selectedRow) {
      form.reset({
        start_date: selectedRow.start_date,
        end_date: selectedRow.end_date,
        total_leave_days: selectedRow.total_leave_days,
        total_leave_hours: selectedRow.total_leave_hours,
        reason: selectedRow.reason,
        rejected_reason: selectedRow?.rejected_reason || "",
      });
    }
    setSelectRow(selectedRow);
  }, [rowValue, leaveRequestList]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      disabled
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "P")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      disabled
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "P")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled
          control={form.control}
          name="total_leave_days"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total leave days</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Total leave days"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled
          control={form.control}
          name="total_leave_hours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total leave hours</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Total leave hours"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Input placeholder="Reason" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={selectRow?.status !== status.pending}
          control={form.control}
          name="rejected_reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rejected reason</FormLabel>
              <FormControl>
                <Input
                  placeholder="Rejected reason"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <div className="text-red-600">{error}</div>}{" "}
        {selectRow?.status === status.pending ? (
          <div className="flex gap-5">
            {" "}
            <Button
              type="button"
              onClick={() =>
                form.handleSubmit((values) =>
                  onSubmit({ ...values, status: status.approved })
                )()
              }
            >
              {loadingApprove ? <LoadingSpinner className="" /> : <>Approve</>}
            </Button>
            <Button
              variant="destructive"
              type="button"
              onClick={() =>
                form.handleSubmit((values) =>
                  onSubmit({ ...values, status: status.rejected })
                )()
              }
            >
              {loadingReject ? <LoadingSpinner className="" /> : <>Reject</>}
            </Button>{" "}
          </div>
        ) : (
          <Button type="button" onClick={() => setOpen(false)}>
            Done
          </Button>
        )}
      </form>
    </Form>
  );
};

export default ManagerForm;
