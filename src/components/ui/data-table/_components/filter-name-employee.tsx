import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui";

const FilterNameEmployee = <TData,>({
  table,
  column,
}: {
  table: Table<TData>;
  column: string;
}) => {
  return (
    <Input
      placeholder="Filter employee name..."
      value={(table.getColumn(column)?.getFilterValue() as string) ?? ""}
      onChange={(event) =>
        table.getColumn(column)?.setFilterValue(event.target.value)
      }
      className="w-fit bg-white"
    />
  );
};

export default FilterNameEmployee;
