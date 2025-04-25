import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Table } from "@tanstack/react-table";

const STATUS = ["All", "Pending", "Approved", "Rejected", "Cancelled"];

export const FilterStatus = <TData,>({ table }: { table: Table<TData> }) => {
  const checkSelectStatus = (value: string) => {
    if (value === "All") {
      table.getColumn("status")?.setFilterValue(undefined);
    } else {
      table.getColumn("status")?.setFilterValue(value);
    }
  };

  return (
    <Select
      onValueChange={(value) => checkSelectStatus(value)}
      value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
    >
      <SelectTrigger className="w-full sm:w-fit bg-white">
        <SelectValue placeholder="Filter status" />
      </SelectTrigger>
      <SelectContent>
        {STATUS.map((value) => {
          return (
            <SelectItem key={value} value={value}>
              {value}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
