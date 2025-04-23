import { DataTableEmployee } from "@/components/ui/data-table/data-table-employee";
import {
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components";
import type { ListEmployeeType } from "./list-employee-type";
import { useState, useEffect } from "react";
import { getListEmployee } from "./action";
import { columnsHR } from "./column-table-for-role/column-for-hr";
import { useAppSelector } from "@/hook/redux-hook";
import { getManager } from "@/features/leave-request/list-leave-request/action";
import { getListEmployeeOfManager } from "./action/get-list-employee-of-manager";

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
      {!loading && data ? (
        <Tabs defaultValue="all" className="w-full h-full">
          <div className="flex justify-center items-center gap-5">
            <TabsList className="cursor-pointer">
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            <TabsList className="gap-2 cursor-pointer">
              {manager &&
                manager.map((m) => {
                  return (
                    <TabsTrigger
                      key={m.user_id}
                      value={m.user_id}
                      onClick={() => getEmployeeOfManager(m.user_id)}
                    >
                      {m.full_name}
                    </TabsTrigger>
                  );
                })}
            </TabsList>
          </div>
          <TabsContent value="all">
            {loading ? (
              <div className="flex justify-center items-center w-full">
                <Skeleton className="h-[300px] w-full rounded-xl" />
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <DataTableEmployee columns={columnsHR} data={data} />
              </div>
            )}
          </TabsContent>
          {manager &&
            manager.map((m) => {
              return (
                <TabsContent key={m.user_id} value={m.user_id}>
                  {managerLoading ? (
                    <div className="flex justify-center items-center w-full">
                      <Skeleton className="h-[300px] w-full rounded-xl" />
                    </div>
                  ) : (
                    dataManager && (
                      <div className="flex flex-col gap-5">
                        <DataTableEmployee
                          columns={columnsHR}
                          data={dataManager}
                        />
                      </div>
                    )
                  )}
                </TabsContent>
              );
            })}
        </Tabs>
      ) : (
        <div className=" w-full h-full">
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      )}
    </div>
  );
};

export default ListEmployeeHR;
