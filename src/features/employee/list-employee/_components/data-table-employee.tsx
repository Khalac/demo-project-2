import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import * as XLSX from "xlsx";
import { useContext } from "react";
import { EmployeeDetailContext } from "../../employee-detail/model";
import { DataTablePagination, Separator } from "@/components";
import { useState } from "react";
import { useAppSelector } from "@/hook/redux-hook";
import { FilterNameEmployee, DownloadData, DataTable } from "@/components";
import { Skeleton } from "@/components";
import { format } from "date-fns";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
}

export function DataTableEmployee<TData, TValue>({
  columns,
  data,
  loading,
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
  const exportToExcel = (data: any) => {
    const exportData = data.map((d: any) => ({
      EmployeeName: d.full_name,
      EmployeeEmail: d.email,
      ManagerName: d.manager.full_name,
      ManagerEmail: d.manager.email,
      OnboardDate: d.onboard_date,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, `Employees.xlsx`);
  };

  return (
    <div className="flex flex-col gap-5 rounded-md border bg-white p-5 h-fit">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
        <div className="flex flex-col gap-2">
          <div className="text-2xl sm:text-3xl font-bold">List employees</div>
          <div className="text-sm">{format(new Date(), "PPPP")}</div>
        </div>
        <div className="flex sm:justify-end">
          {user.role === "HR" && (
            <DownloadData data={data} exportToExcel={exportToExcel} />
          )}
        </div>
      </div>

      <Separator className="w-full" />

      <div className="flex flex-col sm:flex-row sm:justify-end gap-5">
        {user.role !== "EMPLOYEE" && (
          <div className="w-full sm:w-auto">
            <FilterNameEmployee table={table} column="full_name" />
          </div>
        )}
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
