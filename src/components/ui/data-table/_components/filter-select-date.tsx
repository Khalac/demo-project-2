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

const FilterSelectDate = ({
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
          variant={"outline"}
          className={cn(
            "w-fit pl-3 text-left font-normal",
            !globalFilter && "text-muted-foreground"
          )}
        >
          {globalFilter ? (
            format(globalFilter, "P")
          ) : (
            <span>Filter leave date</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={globalFilter}
          onSelect={setGlobalFilter}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default FilterSelectDate;
