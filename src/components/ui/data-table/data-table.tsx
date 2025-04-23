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
} from "@/components/ui";
import { Plus } from "lucide-react";
import { useContext } from "react";
import { UpdateLeaveRequestContext } from "@/context";
import { DataTablePagination } from "../pagination";
import { useState } from "react";
import { useAppSelector } from "@/hook/redux-hook";
import { CreateLeaveRequestContext } from "@/context";
import { FilterSelectDate, FilterStatus } from "./_components";
import FilterNameEmployee from "./_components/filter-name-employee";
import DownloadData from "./_components/download-data";
import ApproveRejectRequest from "./_components/approve-reject-request";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const { setOpen } = useContext(CreateLeaveRequestContext);
  const user = useAppSelector((state) => state.user.user);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { setOpenUpdate, setRowValue } = useContext(UpdateLeaveRequestContext);
  const [globalFilter, setGlobalFilter] = useState<Date>();
  const [rowSelection, setRowSelection] = useState({});

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
      <div className="flex justify-between items-center top-0">
        <div className="flex items-center gap-5">
          <FilterSelectDate
            setGlobalFilter={setGlobalFilter}
            globalFilter={globalFilter}
          />
          <FilterStatus table={table} />
          {user.role !== "EMPLOYEE" && (
            <div className="flex items-center gap-5">
              <FilterNameEmployee table={table} />
            </div>
          )}
        </div>
        <div className="flex items-center gap-5">
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
              className="flex cursor-pointer gap-2"
              onClick={() => setOpen(true)}
            >
              <Plus /> Create new request
            </Button>
          )}
        </div>
      </div>
      <div className="rounded-md border bg-white min-h-20 flex-1">
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
                  onDoubleClick={() => getValueData(row.original)}
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
