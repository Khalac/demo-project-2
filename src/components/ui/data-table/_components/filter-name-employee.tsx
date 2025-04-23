import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui";

const FilterNameEmployee = <TData,>({ table }: { table: Table<TData> }) => {
  return (
    <Input
      placeholder="Filter employee name..."
      value={
        (table.getColumn("users_full_name")?.getFilterValue() as string) ?? ""
      }
      onChange={(event) =>
        table.getColumn("users_full_name")?.setFilterValue(event.target.value)
      }
      className="w-fit bg-white"
    />
  );
};

export default FilterNameEmployee;
