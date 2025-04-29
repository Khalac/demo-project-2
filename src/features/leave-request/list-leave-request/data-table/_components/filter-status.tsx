import { Button } from "@/components/ui";
import { Table } from "@tanstack/react-table";
import { useState } from "react";

const STATUS = ["All", "Pending", "Approved", "Rejected", "Cancelled"];

export const FilterStatus = <TData,>({ table }: { table: Table<TData> }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const checkSelectStatus = (value: string) => {
    setSelectedStatus(value);
    if (value === "All") {
      table.getColumn("status")?.setFilterValue(undefined);
    } else {
      table.getColumn("status")?.setFilterValue(value);
    }
  };

  return (
    <div className="flex flex-wrap sm:flex-nowrap gap-2 justify-center sm:justify-start">
      {STATUS.map((value) => (
        <Button
          key={value}
          onClick={() => checkSelectStatus(value)}
          variant={selectedStatus === value ? "default" : "outline"}
          className="text-xs"
        >
          {value}
        </Button>
      ))}
    </div>
  );
};
