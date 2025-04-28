import { useState, useEffect } from "react";
import { getListLeaveRequest, listenToLeaveRequestTable } from "./action";
import { DataTableLeaveRequest } from "./data-table";
import type { ListleaveRequest } from "./model";
import { columnsEmployee, columnsManager } from "./list-for-role";
import { useAppDispatch } from "@/hook/redux-hook";
import { saveListLeaveRequest } from "./model/slice";
import { ColumnDef } from "@tanstack/react-table";
import { useAppSelector } from "@/hook/redux-hook";
import { Statistic } from "../statistic";

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
  console.log(data);
  return (
    <div className="py-5 h-1/2 items-center w-full">
      {data && (
        <div className="flex flex-col gap-5">
          <DataTableLeaveRequest
            columns={columns}
            data={data}
            loading={loading}
          />
          {role === "MANAGER" && <Statistic data={data} />}
        </div>
      )}
    </div>
  );
};

export default ListLeaveRequest;
