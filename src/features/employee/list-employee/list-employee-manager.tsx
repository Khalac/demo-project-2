import { DataTableEmployee } from "@/components/ui/data-table/data-table-employee";
import { Skeleton } from "@/components";
import type { ListEmployeeType } from "./list-employee-type";
import { useState, useEffect } from "react";
import { getListEmployee } from "./action";
import { columnsManager } from "./column-table-for-role/column-for-manager";

const ListEmployeeManager = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ListEmployeeType[]>();
  const userListLeaveRequest = async () => {
    const res = await getListEmployee();
    if (!res.success) return;
    setData(res.data?.filter((item) => item.role === "EMPLOYEE"));
    setLoading(false);
  };
  useEffect(() => {
    userListLeaveRequest();
  }, []);

  return (
    <div className="py-5 h-1/2 items-center w-full">
      {!loading && data ? (
        <div className="flex flex-col gap-5">
          <DataTableEmployee columns={columnsManager} data={data} />
        </div>
      ) : (
        <div className="flex justify-center items-center w-full">
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      )}
    </div>
  );
};

export default ListEmployeeManager;
