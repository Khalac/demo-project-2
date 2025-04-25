import { DataTableEmployee } from "./_components";
import type { ListEmployeeType } from "./model";
import { useState, useEffect } from "react";
import { getListEmployee } from "./action";
import { columnsHR } from "./column-table-for-role";
import { getManager } from "@/features/leave-request/list-leave-request/action";
import { getListEmployeeOfManager } from "./action";
import { ManagerTab } from "@/components";

type manager = {
  user_id: string;
  full_name: string;
};

const ListEmployeeHR = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ListEmployeeType[]>();
  const [manager, setManager] = useState<manager[]>();
  const [dataManager, setDataManager] = useState<ListEmployeeType[]>();
  const [managerLoading, setManagerLoading] = useState(false);

  const getEmployees = async () => {
    setLoading(true);
    const manager = await getManager();
    if (!manager.success) return;
    setManager(manager.data!);
    const res = await getListEmployee();
    if (!res.success) return;
    setData(res.data?.filter((item) => item.role === "EMPLOYEE"));
    setLoading(false);
  };

  useEffect(() => {
    getEmployees();
  }, []);
  const getEmployeeOfManager = async (id: string) => {
    setManagerLoading(true);
    const requestData = await getListEmployeeOfManager(id);
    if (!requestData.success) return;

    setDataManager(requestData.data);
    setManagerLoading(false);
  };
  return (
    <div className="w-full h-full flex justify-center items-center">
      <ManagerTab
        manager={manager}
        fn={getEmployeeOfManager}
        data={data}
        dataManager={dataManager}
        loading={loading}
        loadingGetManager={managerLoading}
      >
        {(currentData, isLoading) => (
          <>
            <DataTableEmployee
              columns={columnsHR}
              data={currentData}
              loading={isLoading}
            />
          </>
        )}
      </ManagerTab>
    </div>
  );
};

export default ListEmployeeHR;
