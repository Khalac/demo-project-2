import { useState, useEffect } from "react";
import { getListLeaveRequest, listenToLeaveRequestTable } from "./action";
import { getManager } from "./action";
import {
  DataTable,
  LoadingSpinner,
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
  const [changeTabLoading, setChangeTabLoading] = useState(false);
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
    setChangeTabLoading(true);
    const requestData = await getListLeaveRequestEachManager(id);
    if (!requestData.success) return;

    setDataManager(requestData.data);
    setChangeTabLoading(false);
  };

  return (
    <div className="py-5">
      {!loading && data ? (
        <Tabs defaultValue="all">
          <div className="flex justify-center items-center gap-5">
            <TabsList className="">
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            <TabsList className="gap-2">
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
            <DataTable columns={columnsHR} data={data} />
          </TabsContent>
          {manager &&
            manager.map((m) => {
              return (
                <TabsContent key={m.user_id} value={m.user_id}>
                  {!dataManager ? (
                    <LoadingSpinner className="" />
                  ) : (
                    <DataTable columns={columnsHR} data={dataManager} />
                  )}
                </TabsContent>
              );
            })}
        </Tabs>
      ) : (
        <LoadingSpinner className="" />
      )}
    </div>
  );
};

export default ListLeaveRequestHR;
