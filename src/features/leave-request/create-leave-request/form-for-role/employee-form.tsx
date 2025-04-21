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
import { useState } from "react";
import { leaveRequestFormSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNewLeaveRequest } from "../action";
import type { LeaveRequestData } from "../leave-request-data-type";
import { toast } from "sonner";
import { useAppSelector } from "@/hook/redux-hook";
import { convertLocalDateToUTC } from "@/utils";

const EmployeeForm = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const leaveRequest = useAppSelector(
    (state) => state.listLeaveRequest.listLeaveRequest
  );
  const user = useAppSelector((state) => state.user.user);
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(leaveRequestFormSchema(leaveRequest, user.user_id)),
    defaultValues: {
      start_date: undefined,
      end_date: undefined,
      total_leave_days: 0,
      total_leave_hours: 0,
      reason: "",
    },
    mode: "onChange",
  });
  async function onSubmit(values: LeaveRequestData) {
    setLoading(true);
    const utcStartDate = convertLocalDateToUTC(values.start_date);
    const utcEndDate = convertLocalDateToUTC(values.end_date);

    const data = await createNewLeaveRequest(
      utcStartDate,
      utcEndDate,
      values.total_leave_days,
      values.total_leave_hours,
      values.reason
    );
    if (!data.success) {
      setLoading(false);
      setError(error);
      return;
    }
    form.reset();
    setLoading(false);
    setOpen(false);
    toast.success("Create new request successfully");
  }
  return (
    <div className="p-5 flex flex-col gap-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex justify-between gap-5">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start date</FormLabel>
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
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
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
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
          </div>
          <FormField
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
          {error && <div className="text-red-600">{error}</div>}

          <Button
            disabled={!form.formState.isDirty || !form.formState.isValid}
            type="submit"
            className=""
          >
            {loading ? <LoadingSpinner className="" /> : <>Submit</>}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EmployeeForm;
