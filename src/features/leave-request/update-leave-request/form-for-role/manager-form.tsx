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
  Textarea,
  Skeleton,
} from "@/components/ui";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib";
import { useForm } from "react-hook-form";
import { useState, useEffect, useContext } from "react";
import { leaveRequestFormSchema } from "../../create-leave-request/model";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LeaveRequestData } from "../../create-leave-request";
import { toast } from "sonner";
import type { ListleaveRequest } from "../../list-leave-request";
import { updateLeaveRequest } from "../action";
import { convertLocalDateToUTC } from "@/utils";
import { status } from "../../list-leave-request";
import { UpdateLeaveRequestContext } from "../model";
import { getListLeaveRequest } from "../../list-leave-request/action";

const ManagerForm = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { rowValue } = useContext(UpdateLeaveRequestContext);
  const [leaveRequestList, setLeaveRequestList] =
    useState<ListleaveRequest[]>();
  const [loading, setLoading] = useState(false);
  const getLeaveRequestList = async () => {
    setLoading(true);
    const data = await getListLeaveRequest();
    if (!data.success) {
      setLoading(false);
      return;
    }
    setLeaveRequestList(data.data);
    setLoading(false);
  };
  useEffect(() => {
    getLeaveRequestList();
  }, [rowValue]);

  const filteredLeaveRequestList = leaveRequestList?.filter(
    (req) => req.request_id !== rowValue?.request_id
  );
  const [error, setError] = useState<any>();
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [selectRow, setSelectRow] = useState<ListleaveRequest>();

  const form = useForm({
    resolver: zodResolver(
      leaveRequestFormSchema(filteredLeaveRequestList!, rowValue.user_id!)
    ),
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
    const selectedRow = leaveRequestList?.find(
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
  const handleStartDateChange = (field: any, value: any) => {
    field.onChange(value);
    const endDate = form.getValues("end_date");

    if (endDate) {
      form.trigger("end_date");
    } else {
      form.clearErrors("end_date");
    }
  };
  return loading ? (
    <div className="space-y-2 flex flex-col justify-center items-center">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[150px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {" "}
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start date</FormLabel>
              <Popover modal>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      disabled={selectRow?.status !== status.pending}
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
                    onSelect={(date) => handleStartDateChange(field, date)}
                    autoFocus
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
              <Popover modal>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      disabled={selectRow?.status !== status.pending}
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
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={selectRow?.status !== status.pending}
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
          disabled={selectRow?.status !== status.pending}
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
          disabled={selectRow?.status !== status.pending}
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Textarea placeholder="Reason" {...field} />
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
                <Textarea
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
              {loadingApprove ? (
                <LoadingSpinner className="" />
              ) : form.formState.isDirty ? (
                <>Save and Approve</>
              ) : (
                <>Approve</>
              )}
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
              {loadingReject ? (
                <LoadingSpinner className="" />
              ) : form.formState.isDirty ? (
                <>Save and Reject</>
              ) : (
                <>Reject</>
              )}
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
