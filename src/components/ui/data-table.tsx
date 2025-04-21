import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  Row,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Calendar,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
} from "@/components/ui";
import { CalendarIcon, Download } from "lucide-react";
import { cn } from "@/lib";
import { format } from "date-fns";
import { useContext } from "react";
import { UpdateLeaveRequestContext } from "@/context";
import { DataTablePagination } from "./pagination";
import { useState } from "react";
import { useAppSelector } from "@/hook/redux-hook";
import * as XLSX from "xlsx";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const user = useAppSelector((state) => state.user.user);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { setOpenUpdate, setRowValue } = useContext(UpdateLeaveRequestContext);
  const [globalFilter, setGlobalFilter] = useState<Date>();
  const customFilterFn = (
    rows: Row<TData>,
    columnId: any,
    filterValue: any
  ) => {
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
    state: {
      columnFilters,
      globalFilter,
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

  const exportToExcel = (data: any[], fileName: string) => {
    const exportData = data.map((d) => ({
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
    <div className="flex flex-col gap-5 rounded-md border bg-white p-5">
      <div className="flex justify-between items-center">
        {" "}
        <div className="flex items-center gap-5">
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
          <Select
            onValueChange={(value) => {
              if (value === "All") {
                table.getColumn("status")?.setFilterValue(undefined);
              } else {
                table.getColumn("status")?.setFilterValue(value);
              }
            }}
            value={
              (table.getColumn("status")?.getFilterValue() as string) ?? ""
            }
          >
            <SelectTrigger className="w-fit bg-white">
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
          {user.role === "HR" && (
            <div className="flex items-center gap-5">
              <Input
                placeholder="Filter employee name..."
                value={
                  (table
                    .getColumn("users_full_name")
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table
                    .getColumn("users_full_name")
                    ?.setFilterValue(event.target.value)
                }
                className="w-fit bg-white"
              />
            </div>
          )}
        </div>
        <div>
          <Button
            className="flex cursor-pointer gap-2"
            onClick={() => exportToExcel(data, "leave-request")}
          >
            <Download />
            Export to Excel
          </Button>
        </div>
      </div>
      <div className="rounded-md border bg-white min-h-20">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => getValueData(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
