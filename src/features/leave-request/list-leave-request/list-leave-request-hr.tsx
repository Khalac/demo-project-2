import { useState, useEffect } from "react";
import { getListLeaveRequest, listenToLeaveRequestTable } from "./action";
import { getManager } from "./action";
import {
  DataTableLeaveRequest,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components";
import type { ListleaveRequest } from "./list-leave-request-data-type";
import { columnsHR } from "./list-for-role";
import { useAppDispatch } from "@/hook/redux-hook";
import { saveListLeaveRequest } from "./slice";
import { getListLeaveRequestEachManager } from "./action/get-list-request-each-manager";
import { Statistic } from "../statistic";

type manager = {
  user_id: string;
  full_name: string;
};

const ListLeaveRequestHR = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [manager, setManager] = useState<manager[]>();
  const [data, setData] = useState<ListleaveRequest[]>();
  const [dataManager, setDataManager] = useState<ListleaveRequest[]>();
  const [managerLoading, setManagerLoading] = useState(false);

  const userListLeaveRequest = async () => {
    setLoading(true);
    const manager = await getManager();
    if (!manager.success) return;
    setManager(manager.data!);
    const res = await getListLeaveRequest();
    if (!res.success) return;
    setData(res.data);
    setLoading(false);
    dispatch(saveListLeaveRequest(res.data));
  };
  useEffect(() => {
    userListLeaveRequest();
    const unsubscribe = listenToLeaveRequestTable(userListLeaveRequest);
    return () => {
      unsubscribe();
    };
  }, []);

  const getRequestForManager = async (id: string) => {
    setManagerLoading(true);
    const requestData = await getListLeaveRequestEachManager(id);
    if (!requestData.success) return;

    setDataManager(requestData.data);
    setManagerLoading(false);
  };
  return (
    <div className="w-full h-full flex justify-center items-center">
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
                    onClick={() => getRequestForManager(m.user_id)}
                  >
                    {m.full_name}
                  </TabsTrigger>
                );
              })}
          </TabsList>
        </div>
        <TabsContent value="all">
          {data && (
            <div className="flex flex-col gap-5">
              <DataTableLeaveRequest
                columns={columnsHR}
                data={data}
                loading={loading}
              />
              <Statistic data={data} />
            </div>
          )}
        </TabsContent>
        {manager &&
          manager.map((m) => {
            return (
              <TabsContent key={m.user_id} value={m.user_id}>
                {dataManager && (
                  <div className="flex flex-col gap-5">
                    <DataTableLeaveRequest
                      columns={columnsHR}
                      data={dataManager}
                      loading={managerLoading}
                    />
                    <Statistic data={dataManager} />
                  </div>
                )}
              </TabsContent>
            );
          })}
      </Tabs>
    </div>
  );
};

export default ListLeaveRequestHR;
