import { Button } from "@/components/ui";
import { Table } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const STATUS = ["All", "Pending", "Approved", "Rejected", "Cancelled"];

export const FilterStatus = <TData,>({ table }: { table: Table<TData> }) => {
  const [searchParam, setSearchParam] = useSearchParams();
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  useEffect(() => {
    const status = searchParam.get("status") || "All";
    setSelectedStatus(status);
    if (status === "All") {
      table.getColumn("status")?.setFilterValue(undefined);
    } else {
      table.getColumn("status")?.setFilterValue(status);
    }
  }, [searchParam]);

  const checkSelectStatus = (value: string) => {
    if (value === "All") {
      searchParam.delete("status");
    } else {
      searchParam.set("status", value);
    }
    setSearchParam(searchParam);
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
