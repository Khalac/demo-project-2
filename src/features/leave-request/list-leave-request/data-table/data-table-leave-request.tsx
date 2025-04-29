import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  Row,
} from "@tanstack/react-table";

import { Button, Separator } from "@/components/ui";
import { Plus } from "lucide-react";
import { useContext } from "react";
import { UpdateLeaveRequestContext } from "../../update-leave-request/model";
import { DataTablePagination } from "@/components/ui";
import { useState } from "react";
import { useAppSelector } from "@/hook/redux-hook";
import { CreateLeaveRequestContext } from "../../create-leave-request";
import { Skeleton } from "@/components/ui";
import {
  SelectDate,
  FilterNameEmployee,
  DownloadData,
  DataTable,
} from "@/components/ui";
import { FilterStatus, RequestBulkAction } from "./_components";
import * as XLSX from "xlsx";
import { format } from "date-fns";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
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
    const original = rows.original as { start_date: string; end_date: string };
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
    state: { columnFilters, globalFilter, rowSelection },
    initialState: { pagination: { pageSize: 5 } },
  });

  const getValueData = (data: any) => {
    setRowValue(data);
    setOpenUpdate(true);
  };

  const exportToExcel = (data: any, fileName: string) => {
    const exportData = data.map((d: any) => ({
      RequestID: d.request_id,
      EmployeeName: d.users?.full_name,
      EmployeeEmail: d.users?.email,
      ManagerName: d.manager?.full_name,
      ManagerEmail: d.manager?.email,
      From: d.start_date,
      To: d.end_date,
      TotalDays: d.total_leave_days,
      TotalHours: d.total_leave_hours,
      Reason: d.reason,
      Status: d.status,
      RejectedReason: d.rejected_reason,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <div className="flex flex-col gap-5 rounded-md border bg-white p-5 h-fit">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
        <div className="flex flex-col gap-2">
          <div className="text-2xl sm:text-3xl font-bold">Leave request</div>
          <div className="text-sm">{format(new Date(), "PPPP")}</div>
        </div>
        <div className="flex sm:justify-end">
          {user.role === "HR" ? (
            <DownloadData data={data} exportToExcel={exportToExcel} />
          ) : (
            <Button
              className="flex gap-2 w-full md:w-[180px]"
              onClick={() => setOpen(true)}
            >
              <Plus /> Create new request
            </Button>
          )}
        </div>
      </div>

      <Separator className="w-full" />

      <div className="flex flex-col sm:flex-row sm:justify-between gap-5">
        <div className="flex flex-wrap gap-2">
          <FilterStatus table={table} />
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-5 w-full sm:w-auto">
          {user.role === "MANAGER" &&
            Object.keys(rowSelection).length !== 0 && (
              <RequestBulkAction
                setRowSelection={setRowSelection}
                rowSelection={rowSelection}
                table={table}
              />
            )}
          {user.role !== "EMPLOYEE" && (
            <div className="w-full sm:w-auto">
              <FilterNameEmployee table={table} column="users_full_name" />
            </div>
          )}
          <SelectDate
            setGlobalFilter={setGlobalFilter}
            globalFilter={globalFilter}
          />
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
