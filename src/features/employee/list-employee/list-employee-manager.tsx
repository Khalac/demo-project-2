import { DataTableEmployee } from "./_components";
import type { ListEmployeeType } from "./model/list-employee-type";
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
      {data && (
        <div className="flex flex-col gap-5">
          <DataTableEmployee
            columns={columnsManager}
            data={data}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default ListEmployeeManager;
