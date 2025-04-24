import { createContext, useState, ReactNode } from "react";

type UserDetailContextType = {
  openUserDetail: boolean;
  setOpenUserDetail: React.Dispatch<React.SetStateAction<boolean>>;
  setAvatar: React.Dispatch<React.SetStateAction<string>>;
  avatar: string;
};

export const UserDetailContext = createContext<UserDetailContextType>({
  openUserDetail: false,
  setOpenUserDetail: () => {},
  setAvatar: () => {},
  avatar: "",
});

export const UserDetailProvider = ({ children }: { children: ReactNode }) => {
  const [openUserDetail, setOpenUserDetail] = useState(false);
  const [avatar, setAvatar] = useState("");
  return (
    <UserDetailContext.Provider
      value={{
        openUserDetail,
        setOpenUserDetail,
        avatar,
        setAvatar,
      }}
    >
      {children}
    </UserDetailContext.Provider>
  );
};
