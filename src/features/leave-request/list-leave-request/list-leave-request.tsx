import { useState, useEffect } from "react";
import getListLeaveRequest from "./get-list-leave-request";
import { listenToLeaveRequestTable } from "./listen-leave-request-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, LoadingSpinner } from "@/components";

enum status {
  pending = "Pending",
  approved = "Approved",
  rejected = "Rejected",
}

type ListleaveRequest = {
  start_date: Date;
  end_date: Date;
  total_leave_days: number;
  total_leave_hours: number;
  reason: string;
  status: status;
  created_at: Date;
  users: {
    full_name: string;
    email: string;
  }[];
};

const columns: ColumnDef<ListleaveRequest>[] = [
  {
    accessorKey: "users.email",
    header: "Email",
  },
  {
    accessorKey: "users.full_name",
    header: "Full name",
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

const ListLeaveRequest = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ListleaveRequest[]>();
  const userListLeaveRequest = async () => {
    const res = await getListLeaveRequest();
    if (!res.success) return;
    setData(res.data);
    setLoading(false);
  };
  useEffect(() => {
    userListLeaveRequest();
    const unsubscribe = listenToLeaveRequestTable(userListLeaveRequest);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="py-5">
      {data ? (
        <DataTable columns={columns} data={data} />
      ) : (
        <LoadingSpinner className="" />
      )}
    </div>
  );
};

export default ListLeaveRequest;
