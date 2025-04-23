import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { useContext } from "react";
import { EmployeeDetailContext } from "@/context";
import { DataTablePagination } from "../pagination";
import { useState } from "react";
import { useAppSelector } from "@/hook/redux-hook";
import { FilterNameEmployee, DownloadData, DataTable } from "./_components";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTableEmployee<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const { setOpenDetail, setRowValueDetail } = useContext(
    EmployeeDetailContext
  );
  const user = useAppSelector((state) => state.user.user);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });
  const getValueData = (data: any) => {
    setRowValueDetail(data);
    setOpenDetail(true);
  };

  return (
    <div className="flex flex-col gap-5 rounded-md border bg-white p-5 h-fit">
      <div className="flex justify-between items-center top-0">
        <div className="flex items-center gap-5">
          <FilterNameEmployee table={table} column="full_name" />
        </div>

        <div className="flex items-center gap-5">
          {user.role === "HR" && <DownloadData data={data} />}
        </div>
      </div>
      <DataTable table={table} columns={columns} getValueData={getValueData} />

      <DataTablePagination table={table} />
    </div>
  );
}
