import { createContext, useState, ReactNode } from "react";

type CreateLeaveContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CreateLeaveRequestContext = createContext<CreateLeaveContextType>({
  open: false,
  setOpen: () => {},
});

export const CreateLeaveRequestProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <CreateLeaveRequestContext.Provider value={{ open, setOpen }}>
      {children}
    </CreateLeaveRequestContext.Provider>
  );
};
