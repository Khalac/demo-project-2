import {
  Button,
  Input,
  FormLabel,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
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
import { leaveRequestFormSchema } from "../../create-leave-request";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ListleaveRequest } from "../../list-leave-request";
import { UpdateLeaveRequestContext } from "../model";
import { getListLeaveRequest } from "../../list-leave-request/action";

const HRForm = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { rowValue } = useContext(UpdateLeaveRequestContext);
  const [loading, setLoading] = useState(false);
  const [leaveRequestList, setLeaveRequestList] =
    useState<ListleaveRequest[]>();
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

  const [selectRow, setSelectRow] = useState<ListleaveRequest>();

  const form = useForm({
    resolver: zodResolver(
      leaveRequestFormSchema(leaveRequestList!, rowValue.user_id!)
    ),
  });
  useEffect(() => {
    const selectedRow = leaveRequestList?.find(
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

  return loading ? (
    <div className="space-y-2 flex flex-col justify-center items-center">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[150px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  ) : (
    <Form {...form}>
      <form className="space-y-8">
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
                      disabled
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
                      disabled
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
                <Textarea placeholder="Reason" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {selectRow?.rejected_reason && (
          <FormField
            disabled
            control={form.control}
            name="rejected_reason"
            render={() => (
              <FormItem>
                <FormLabel>Rejected reason</FormLabel>
                <FormControl>
                  <Textarea disabled value={selectRow?.rejected_reason} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="button" className="" onClick={() => setOpen(false)}>
          Done
        </Button>
      </form>
    </Form>
  );
};

export default HRForm;
