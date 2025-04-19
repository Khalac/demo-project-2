import { useState, useEffect } from "react";
import { getListLeaveRequest, listenToLeaveRequestTable } from "./action";
import { DataTable, LoadingSpinner } from "@/components";
import type { ListleaveRequest } from "./list-leave-request-data-type";
import { columnsEmployee, columnsManager } from "./list-for-role";
import { useAppDispatch } from "@/hook/redux-hook";
import { saveListLeaveRequest } from "./slice";
import { memo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useAppSelector } from "@/hook/redux-hook";

const roles = ["EMPLOYEE", "MANAGER"] as const;
type Role = (typeof roles)[number];

type ColumnMap = Record<Role, ColumnDef<ListleaveRequest, any>[]>;

export const columnsByRole: ColumnMap = {
  EMPLOYEE: columnsEmployee,

  MANAGER: columnsManager,
};

const ListLeaveRequest = () => {
  const user = useAppSelector((state) => state.user.user);
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
  const role = user?.role as keyof typeof columnsByRole;
  const columns = columnsByRole[role];
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

export default memo(ListLeaveRequest);
