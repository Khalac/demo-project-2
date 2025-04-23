import { Button } from "@/components/ui";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

const DownloadData = <TData,>({ data }: { data: TData[] }) => {
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
    <Button
      className="flex cursor-pointer gap-2"
      onClick={() => exportToExcel(data, "leave-request")}
    >
      <Download />
      Export to Excel
    </Button>
  );
};

export default DownloadData;
