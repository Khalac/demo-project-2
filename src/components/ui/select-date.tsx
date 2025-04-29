import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Calendar,
} from "@/components/ui";
import { cn } from "@/lib";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

export const SelectDate = ({
  globalFilter,
  setGlobalFilter,
}: {
  globalFilter: Date | undefined;
  setGlobalFilter: React.Dispatch<React.SetStateAction<Date | undefined>>;
}) => {
  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex items-center gap-2 w-full md:w-[180px] justify-start font-normal truncate",
            !globalFilter && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="h-4 w-4 opacity-50" />
          <span className="truncate">
            {globalFilter ? format(globalFilter, "P") : "Filter leave date"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={globalFilter}
          onSelect={setGlobalFilter}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
};
