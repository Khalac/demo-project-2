import { ColumnDef } from "@tanstack/react-table";
import type { ListEmployeeType } from "../list-employee-type";

export const columnsHR: ColumnDef<ListEmployeeType>[] = [
  { accessorKey: "full_name", header: "Employee name" },
  {
    accessorKey: "email",
    header: "Employee email",
  },
  { accessorKey: "manager.full_name", header: "Manager name" },
  {
    accessorKey: "manager.email",
    header: "Manager email",
  },
  {
    accessorKey: "onboard_date",
    header: "Onboard date",
  },
];
