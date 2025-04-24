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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib";
import { useForm } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";
import { leaveRequestFormSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNewLeaveRequest } from "../action";
import type { LeaveRequestData } from "../leave-request-data-type";
import { toast } from "sonner";
import { useAppSelector } from "@/hook/redux-hook";
import { convertLocalDateToUTC } from "@/utils";
import {
  getManagedEmployee,
  ListEmployee,
} from "../action/get-managed-employee";
import { getLeaveDetail } from "../../user-leave-detail/action";

type UserLeaveDetail = {
  total_leaves: number;
  total_used_leaves: number;
  total_waiting_leaves: number;
};

const ManagerForm = ({
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
  const [getEmployeesLoading, setGetEmployeesLoading] = useState(false);
  const [listEmployees, setListEmployees] = useState<ListEmployee[]>();
  const [userIdSelect, setUserIdSelect] = useState("");
  const [leaveDetail, setLeaveDetail] = useState<UserLeaveDetail>();
  const [isPending, startTransition] = useTransition();

  const getUserLeaveDetail = async (id: string) => {
    startTransition(async () => {
      const data = await getLeaveDetail(id);
      if (!data.success) return;
      setLeaveDetail(data.data);
    });
  };

  const form = useForm({
    resolver: zodResolver(leaveRequestFormSchema(leaveRequest, userIdSelect)),
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
      values.reason,
      values.user_id
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
  const getAllManagedEmployee = async () => {
    setGetEmployeesLoading(true);
    const data = await getManagedEmployee();
    if (!data.success) return;

    setListEmployees(data.data);
    setGetEmployeesLoading(false);
  };
  useEffect(() => {
    getAllManagedEmployee();
  }, []);
  const handleStartDateChange = (field: any, value: any) => {
    field.onChange(value);
    const endDate = form.getValues("end_date");

    if (endDate) {
      form.trigger("end_date");
    } else {
      form.clearErrors("end_date");
    }
  };
  const isOutOfLeave =
    leaveDetail &&
    leaveDetail?.total_leaves ===
      leaveDetail?.total_used_leaves + leaveDetail?.total_waiting_leaves;
  return (
    <div className="sm:p-5 px-5 flex flex-col overflow-auto">
      {getEmployeesLoading ? (
        <LoadingSpinner className="" />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="user_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setUserIdSelect(value);
                      getUserLeaveDetail(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select an employee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {listEmployees?.map((employee) => {
                        if (user.user_id === employee.user_id) return null;
                        return (
                          <SelectItem
                            key={employee.user_id}
                            value={employee.user_id}
                          >
                            {employee.full_name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
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
                          disabled={isPending || isOutOfLeave}
                          variant={"outline"}
                          className={cn(
                            "w-[250px] pl-3 text-left font-normal",
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
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={isPending || isOutOfLeave}
                          variant={"outline"}
                          className={cn(
                            "w-[250px] pl-3 text-left font-normal",
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
              disabled={isPending || isOutOfLeave}
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
              disabled={isPending || isOutOfLeave}
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
              disabled={isPending || isOutOfLeave}
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
            {isOutOfLeave && (
              <div className="text-red-600">
                This employee is out of leave request
              </div>
            )}
            <Button
              disabled={
                !form.formState.isDirty ||
                !form.formState.isValid ||
                isPending ||
                isOutOfLeave
              }
              type="submit"
              className=""
            >
              {loading ? <LoadingSpinner className="" /> : <>Submit</>}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ManagerForm;
