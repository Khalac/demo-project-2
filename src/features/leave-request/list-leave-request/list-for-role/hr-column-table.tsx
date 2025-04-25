import { ColumnDef } from "@tanstack/react-table";
import type { ListleaveRequest } from "../model/list-leave-request-data-type";

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
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      switch (status) {
        case "PENDING":
          return (
            <div className="flex justify-center items-center gap-1 w-fit rounded-xl py-1 px-2 text-xs text-yellow-500 bg-yellow-100 font-medium">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              Pending
            </div>
          );
        case "APPROVED":
          return (
            <div className="flex justify-center items-center gap-1 w-fit rounded-xl py-1 px-2 text-xs text-green-600 bg-green-100 font-medium">
              <div className="w-2 h-2 rounded-full bg-green-600"></div>
              Approved
            </div>
          );
        case "REJECTED":
          return (
            <div className="flex justify-center items-center gap-1 w-fit rounded-xl py-1 px-2 text-xs text-red-600 bg-red-100 font-medium">
              <div className="w-2 h-2 rounded-full bg-red-600"></div>
              Rejected
            </div>
          );
        case "CANCELLED":
        case "CANCELED":
          return (
            <div className="flex justify-center items-center gap-1 w-fit rounded-xl py-1 px-2 text-xs text-gray-500 bg-gray-100 font-medium">
              <div className="w-2 h-2 rounded-full bg-gray-500"></div>
              Cancelled
            </div>
          );
        default:
          return <div>{status}</div>;
      }
    },
  },
];
