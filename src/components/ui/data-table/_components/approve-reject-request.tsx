import { Button, LoadingSpinner } from "@/components/ui";
import { bulkUpdateLeaveRequest } from "@/features/leave-request/update-leave-request";
import { convertLocalDateToUTC } from "@/utils";
import { useState, useTransition } from "react";
import { status } from "@/features/leave-request";
import type { ListleaveRequest } from "@/features/leave-request";
import { toast } from "sonner";
import { Table } from "@tanstack/react-table";

const ApproveRejectRequest = <TData,>({
  table,
  rowSelection,
  setRowSelection,
}: {
  table: Table<TData>;
  rowSelection: Record<number, boolean>;
  setRowSelection: React.Dispatch<
    React.SetStateAction<Record<number, boolean>>
  >;
}) => {
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [isPending, startTransition] = useTransition();
  const manageLeaveRequest = async (type: status) => {
    startTransition(async () => {
      if (type === "APPROVED") setLoadingApprove(true);
      else setLoadingReject(true);

      const dataLeaveRequest = Object.keys(rowSelection).map((index) => {
        const row = table.getRowModel().rowsById[parseInt(index)]
          ?.original as ListleaveRequest;
        const utcStartDate = convertLocalDateToUTC(row.start_date);
        const utcEndDate = convertLocalDateToUTC(row.end_date);
        const updated_at = new Date();
        return {
          total_leave_days: row.total_leave_days,
          total_leave_hours: row.total_leave_hours,
          start_date: utcStartDate,
          end_date: utcEndDate,
          rejected_reason: row.rejected_reason,
          status: type,
          request_id: row.request_id!,
          updated_at: updated_at,
          reason: row.reason,
        };
      }) as ListleaveRequest[];

      const data = await bulkUpdateLeaveRequest(dataLeaveRequest);
      if (!data.success) {
        setLoadingApprove(false);
        setLoadingReject(false);
        toast.error("Error");
      }
      setRowSelection({});
      toast.success("Success");
      setLoadingApprove(false);
      setLoadingReject(false);
    });
  };
  return (
    <div className="flex gap-5">
      <Button
        disabled={
          !Object.keys(rowSelection).every((rowIndex) => {
            const row = table.getRowModel().rowsById[parseInt(rowIndex)]
              ?.original as ListleaveRequest;
            return row.status === status.pending;
          }) || isPending
        }
        variant="outline"
        onClick={() => manageLeaveRequest(status.approved)}
      >
        {loadingApprove ? <LoadingSpinner className="" /> : <>Approve all</>}
      </Button>
      <Button
        disabled={
          !Object.keys(rowSelection).every((rowIndex) => {
            const row = table.getRowModel().rowsById[parseInt(rowIndex)]
              ?.original as ListleaveRequest;
            return row.status === status.pending;
          }) || isPending
        }
        variant="destructive"
        onClick={() => manageLeaveRequest(status.rejected)}
      >
        {loadingReject ? <LoadingSpinner className="" /> : <>Reject all</>}
      </Button>
    </div>
  );
};

export default ApproveRejectRequest;
