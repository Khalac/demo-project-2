import { useState, useEffect } from "react";
import { getListLeaveRequest, listenToLeaveRequestTable } from "./action";
import { DataTable, LoadingSpinner } from "@/components";
import type { ListleaveRequest } from "./list-leave-request-data-type";
import { columns } from "./column-table-list-leave-request";
import { useAppDispatch } from "@/hook/redux-hook";
import { saveListLeaveRequest } from "./slice";

const ListLeaveRequest = ({
  setOpenUpdate,
  setRowValue,
}: {
  setOpenUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  setRowValue: React.Dispatch<React.SetStateAction<ListleaveRequest>>;
}) => {
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
        <DataTable
          columns={columns}
          data={data}
          setOpenUpdate={setOpenUpdate}
          setRowValue={setRowValue}
        />
      ) : (
        <LoadingSpinner className="" />
      )}
    </div>
  );
};

export default ListLeaveRequest;
