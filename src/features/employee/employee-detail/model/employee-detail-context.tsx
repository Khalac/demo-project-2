import { createContext, useState, ReactNode } from "react";
import type { ListEmployeeType } from "@/features/employee/list-employee/model/list-employee-type";

type EmployeeDetailContextType = {
  openDetail: boolean;
  setOpenDetail: React.Dispatch<React.SetStateAction<boolean>>;
  rowValueDetail: ListEmployeeType;
  setRowValueDetail: React.Dispatch<React.SetStateAction<ListEmployeeType>>;
};

export const EmployeeDetailContext = createContext<EmployeeDetailContextType>({
  openDetail: false,
  setOpenDetail: () => {},
  rowValueDetail: {} as ListEmployeeType,
  setRowValueDetail: () => {},
});

export const EmployeeDetailProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [openDetail, setOpenDetail] = useState(false);
  const [rowValueDetail, setRowValueDetail] = useState<ListEmployeeType>(
    {} as ListEmployeeType
  );

  return (
    <EmployeeDetailContext.Provider
      value={{ openDetail, setOpenDetail, rowValueDetail, setRowValueDetail }}
    >
      {children}
    </EmployeeDetailContext.Provider>
  );
};
