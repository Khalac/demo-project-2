import { Button } from "@/components/ui";
import { Download } from "lucide-react";

const DownloadData = <TData,>({
  data,
  exportToExcel,
}: {
  data: TData[];
  exportToExcel: (data: TData[]) => void;
}) => {
  return (
    <Button
      className="flex justify-center items-center gap-2 w-full md:w-[180px] truncate"
      onClick={() => exportToExcel(data)}
    >
      <Download className="h-4 w-4 opacity-50" />
      <span className="truncate">Export to Excel</span>
    </Button>
  );
};

export default DownloadData;
