import { useState, useEffect } from "react";
import getListLeaveRequest from "./get-list-leave-request";
import { listenToLeaveRequestTable } from "./listen-leave-request-table";
import { DataTable, LoadingSpinner } from "@/components";
import type { ListleaveRequest } from "./list-leave-request-data-type";
import { columns } from "./column-table-list-leave-request";
import { useAppDispatch } from "@/hook/redux-hook";
import { saveListLeaveRequest } from "./slice";

const ListLeaveRequest = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ListleaveRequest[]>();
  const userListLeaveRequest = async () => {
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

  return (
    <div className="py-5">
      {!loading && data ? (
        <DataTable columns={columns} data={data} />
      ) : (
        <LoadingSpinner className="" />
      )}
    </div>
  );
};

export default ListLeaveRequest;
