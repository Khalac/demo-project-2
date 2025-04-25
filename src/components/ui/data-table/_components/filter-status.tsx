import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Table } from "@tanstack/react-table";

const FilterStatus = <TData,>({ table }: { table: Table<TData> }) => {
  return (
    <Select
      onValueChange={(value) => {
        if (value === "All") {
          table.getColumn("status")?.setFilterValue(undefined);
        } else {
          table.getColumn("status")?.setFilterValue(value);
        }
      }}
      value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
    >
      <SelectTrigger className="w-full sm:w-fit bg-white">
        <SelectValue placeholder="Filter status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All">All</SelectItem>
        <SelectItem value="Pending">Pending</SelectItem>
        <SelectItem value="Approved">Approved</SelectItem>
        <SelectItem value="Rejected">Rejected</SelectItem>
        <SelectItem value="Cancelled">Cancelled</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default FilterStatus;
