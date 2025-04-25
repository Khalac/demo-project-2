import { createContext, useState, ReactNode } from "react";
import type { ListleaveRequest } from "@/features/leave-request/list-leave-request";

type UpdateLeaveContextType = {
  openUpdate: boolean;
  setOpenUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  rowValue: ListleaveRequest;
  setRowValue: React.Dispatch<React.SetStateAction<ListleaveRequest>>;
};

export const UpdateLeaveRequestContext = createContext<UpdateLeaveContextType>({
  openUpdate: false,
  setOpenUpdate: () => {},
  rowValue: {} as ListleaveRequest,
  setRowValue: () => {},
});

export const UpdateLeaveRequestProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [rowValue, setRowValue] = useState<ListleaveRequest>(
    {} as ListleaveRequest
  );

  return (
    <UpdateLeaveRequestContext.Provider
      value={{ openUpdate, setOpenUpdate, rowValue, setRowValue }}
    >
      {children}
    </UpdateLeaveRequestContext.Provider>
  );
};
