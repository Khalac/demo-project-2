import { ColumnDef } from "@tanstack/react-table";
import type { ListleaveRequest } from "../list-leave-request-data-type";

export const columnsEmployee: ColumnDef<ListleaveRequest>[] = [
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
