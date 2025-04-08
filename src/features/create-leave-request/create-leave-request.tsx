import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
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
import { supabase } from "@/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { LeaveRequestFormSchema } from "./schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { tryCatch } from "@/utils";

type LeaveRequestData = z.infer<typeof LeaveRequestFormSchema>;

const CreateLeaveRequest = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(LeaveRequestFormSchema),
    defaultValues: {
      total_leave_days: 0,
      total_leave_hours: 0,
      reason: "",
    },
  });
  async function onSubmit(values: LeaveRequestData) {
    setLoading(true);
    const { error } = await supabase.from("leave_request").insert({
      start_date: values.start_date,
      end_date: values.end_date,
      total_leave_days: values.total_leave_days,
      total_leave_hours: values.total_leave_hours,
      reason: values.reason,
    });
    if (error) {
      setLoading(false);
      setError(error);
    } else {
      setLoading(false);
      setOpen(false);
    }
  }
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create request</SheetTitle>
        </SheetHeader>
        <div className="p-5 flex flex-col gap-5">
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
                    <FormLabel>Total leave hours</FormLabel>
                    <FormControl>
                      <Input placeholder="Reason" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <div className="text-red-600">{error}</div>}
              {loading ? (
                <LoadingSpinner className="" />
              ) : (
                <Button type="submit" className="">
                  Save changes
                </Button>
              )}
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
export default CreateLeaveRequest;
