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

const EmployeeForm: React.FC<{
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rowValue: ListleaveRequest;
}> = ({ setOpen, rowValue }) => {
  const leaveRequestList = useAppSelector(
    (state) => state.listLeaveRequest.listLeaveRequest
  );
  const filteredLeaveRequestList = leaveRequestList.filter(
    (req) => req.request_id !== rowValue?.request_id
  );

  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [selectRow, setSelectRow] = useState<ListleaveRequest>();

  const form = useForm({
    resolver: zodResolver(leaveRequestFormSchema(filteredLeaveRequestList)),
    mode: "onChange",
  });
  async function onSubmit(values: LeaveRequestData) {
    setLoading(true);
    const utcStartDate = convertLocalDateToUTC(values.start_date);
    const utcEndDate = convertLocalDateToUTC(values.end_date);
    const data = await updateLeaveRequest(
      {
        ...values,
        status: status.pending,
        start_date: utcStartDate,
        end_date: utcEndDate,
      },
      selectRow?.request_id!
    );
    if (!data.success) {
      setLoading(false);
      setError(error);
      return;
    }
    setLoading(false);
    setOpen(false);
    toast.success("Update request successfully");
  }
  useEffect(() => {
    if (selectRow && selectRow!.status !== "PENDING") {
      toast.error("Your leave request have been approve or rejected");
    }
    const selectedRow = leaveRequestList.find(
      (lr) => lr.request_id === rowValue.request_id
    );
    setSelectRow(selectedRow);
    if (selectedRow) {
      form.reset({
        start_date: selectedRow.start_date,
        end_date: selectedRow.end_date,
        total_leave_days: selectedRow.total_leave_days,
        total_leave_hours: selectedRow.total_leave_hours,
        reason: selectedRow.reason,
        rejected_reason: "",
      });
    }
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
                      variant={"outline"}
                      disabled={selectRow?.status !== status.pending}
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
                      variant={"outline"}
                      disabled={selectRow?.status !== status.pending}
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
          disabled={selectRow?.status !== status.pending}
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
          control={form.control}
          disabled={selectRow?.status !== status.pending}
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
          control={form.control}
          disabled={selectRow?.status !== status.pending}
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
        {selectRow?.rejected_reason && (
          <FormField
            control={form.control}
            name="rejected_reason"
            render={() => (
              <FormItem>
                <FormLabel>Rejected reason</FormLabel>
                <FormControl>
                  <Input disabled value={selectRow?.rejected_reason} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {error && <div className="text-red-600">{error}</div>}
        {selectRow?.status !== "PENDING" && (
          <div className="text-red-600">
            Your request has been {selectRow?.status}
          </div>
        )}
        <div className="flex gap-5">
          {" "}
          <Button
            disabled={
              !form.formState.isValid ||
              !form.formState.isDirty ||
              selectRow!.status !== "PENDING"
            }
            type="submit"
            className=""
          >
            {loading ? <LoadingSpinner className="" /> : <>Update</>}
          </Button>
          <Button
            variant="secondary"
            type="button"
            className=""
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EmployeeForm;
