import { Button } from "@/components/ui";
import { Download } from "lucide-react";

const DownloadData = <TData,>({
  data,
  exportToExcel,
}: {
  data: TData[];
  exportToExcel: (data: TData[], name: string) => void;
}) => {
  return (
    <Button
      className="flex cursor-pointer gap-2 w-full sm:w-fit"
      onClick={() => exportToExcel(data, "leave-request")}
    >
      <Download />
      Export to Excel
    </Button>
  );
};

export default DownloadData;
