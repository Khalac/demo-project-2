import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  Row,
} from "@tanstack/react-table";

import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { useContext } from "react";
import { UpdateLeaveRequestContext } from "@/context";
import { DataTablePagination } from "../pagination";
import { useState } from "react";
import { useAppSelector } from "@/hook/redux-hook";
import { CreateLeaveRequestContext } from "@/context";
import { Skeleton } from "@/components/ui";
import {
  FilterSelectDate,
  FilterStatus,
  FilterNameEmployee,
  DownloadData,
  ApproveRejectRequest,
  DataTable,
} from "./_components";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
}

export function DataTableLeaveRequest<TData, TValue>({
  columns,
  data,
  loading,
}: DataTableProps<TData, TValue>) {
  const { setOpen } = useContext(CreateLeaveRequestContext);
  const user = useAppSelector((state) => state.user.user);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { setOpenUpdate, setRowValue } = useContext(UpdateLeaveRequestContext);
  const [globalFilter, setGlobalFilter] = useState<Date>();
  const [rowSelection, setRowSelection] = useState({});

  const customFilterFn = (rows: Row<TData>, _: any, filterValue: any) => {
    if (!filterValue) return true;

    const inputDate = new Date(filterValue.getTime() + 7 * 60 * 60 * 1000);

    const original = rows.original as {
      start_date: string;
      end_date: string;
    };

    const start = new Date(original.start_date);
    const end = new Date(original.end_date);

    return inputDate >= start && inputDate <= end;
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: customFilterFn,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      globalFilter,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  const getValueData = (data: any) => {
    setRowValue(data);
    setOpenUpdate(true);
  };

  return (
    <div className="flex flex-col gap-5 rounded-md border bg-white p-5 h-fit">
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-5 sm:gap-0">
        <div className="flex items-center gap-5 flex-wrap sm:flex-nowrap">
          <FilterSelectDate
            setGlobalFilter={setGlobalFilter}
            globalFilter={globalFilter}
          />
          <FilterStatus table={table} />
          {user.role !== "EMPLOYEE" && (
            <div className="flex items-center gap-5 w-full">
              <FilterNameEmployee table={table} column="users_full_name" />
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-5 w-full sm:w-auto">
          {user.role === "HR" && <DownloadData data={data} />}
          {user.role === "MANAGER" &&
            Object.keys(rowSelection).length !== 0 && (
              <ApproveRejectRequest
                setRowSelection={setRowSelection}
                rowSelection={rowSelection}
                table={table}
              />
            )}
          {user.role !== "HR" && (
            <Button
              className="flex cursor-pointer gap-2 w-full sm:w-auto"
              onClick={() => setOpen(true)}
            >
              <Plus /> Create new request
            </Button>
          )}
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center w-full">
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      ) : (
        <DataTable
          table={table}
          columns={columns}
          getValueData={getValueData}
        />
      )}

      <DataTablePagination table={table} />
    </div>
  );
}
