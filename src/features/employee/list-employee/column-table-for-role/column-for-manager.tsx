import { ColumnDef } from "@tanstack/react-table";
import type { ListEmployeeType } from "../model/list-employee-type";

export const columnsManager: ColumnDef<ListEmployeeType>[] = [
  { accessorKey: "full_name", header: "Employee name" },
  {
    accessorKey: "email",
    header: "Employee email",
  },
  {
    accessorKey: "onboard_date",
    header: "Onboard date",
  },
];
