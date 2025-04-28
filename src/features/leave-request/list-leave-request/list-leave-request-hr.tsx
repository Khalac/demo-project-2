import { useState, useEffect } from "react";
import {
  getListLeaveRequest,
  listenToLeaveRequestTable,
  getManager,
  getListLeaveRequestEachManager,
} from "./action";
import { ManagerTab } from "@/components";
import { DataTableLeaveRequest } from "./data-table";
import type { ListleaveRequest } from "./model";
import { columnsHR } from "./list-for-role";
import { useAppDispatch } from "@/hook/redux-hook";
import { saveListLeaveRequest } from "./model/slice";
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
      <ManagerTab
        manager={manager}
        fn={getRequestForManager}
        data={data}
        dataManager={dataManager}
        loading={loading}
        loadingGetManager={managerLoading}
      >
        {(currentData, isLoading) => (
          <>
            <DataTableLeaveRequest
              columns={columnsHR}
              data={currentData}
              loading={isLoading}
            />
            <Statistic data={currentData} />
          </>
        )}
      </ManagerTab>
    </div>
  );
};

export default ListLeaveRequestHR;
