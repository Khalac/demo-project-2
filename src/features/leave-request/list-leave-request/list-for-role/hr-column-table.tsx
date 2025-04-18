import { ColumnDef } from "@tanstack/react-table";
import type { ListleaveRequest } from "../list-leave-request-data-type";

export const columnsHR: ColumnDef<ListleaveRequest>[] = [
  { accessorKey: "manager.email", header: "Manager email" },
  {
    accessorKey: "manager.full_name",
    header: "Manager name",
  },
  { accessorKey: "users.email", header: "Employee email" },
  {
    accessorKey: "users.full_name",
    header: "Employee name",
  },
  {
    accessorKey: "start_date",
    header: "From",
  },
  {
    accessorKey: "end_date",
    header: "To",
  },
  {
    accessorKey: "total_leave_days",
    header: "Total days",
  },
  {
    accessorKey: "total_leave_hours",
    header: "Total hours",
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
