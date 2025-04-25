import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  LoadingSpinner,
  Button,
} from "@/components/ui";
import { logOut } from "@/features/auth/slice";
import { useAppSelector } from "@/hook/redux-hook";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hook/redux-hook";
import { tryCatch } from "@/utils";
import { useContext } from "react";
import { UserDetailContext } from "@/context";
import { downloadAvatar } from "@/features/user/user-information/action/download-avatar";
import { toast } from "sonner";

const UserAvatar = () => {
  const { setOpenUserDetail, avatar, setAvatar } =
    useContext(UserDetailContext);
  const user = useAppSelector((state) => state.user.user);
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    localStorage.removeItem("userId");
    setLoading(true);
    const { data, error } = await tryCatch(dispatch(logOut()).unwrap());
    if (error) {
      setLoading(false);
      toast.error(error.message);
    }
    if (data?.success) {
      setLoading(false);
      navigate("/login");
    }
  };
  const getNewestAvatar = async () => {
    const data = await downloadAvatar(user.avatar_url);
    if (!data.success) return;
    setAvatar(data.data!);
  };
  useEffect(() => {
    getNewestAvatar();
  }, [user.avatar_url]);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none">
        <Avatar>
          <AvatarImage src={avatar} alt="avatar" />
          <AvatarFallback className="font-bold">
            {getInitials(user.full_name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-5">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="focus:bg-white">
          <div className="flex gap-5 p-2">
            <Avatar className="flex justify-center items-center">
              <AvatarImage src={avatar} alt="avatar" />
              <AvatarFallback className="font-bold">
                {getInitials(user.full_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-bold">{user.full_name}</div>
              <div className="font-light text-sm">{user.email}</div>
              <div
                className="text-sm cursor-pointer hover:text-gray-500"
                onClick={() => setOpenUserDetail(true)}
              >
                Manage
              </div>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <Button
            variant="ghost"
            className="cursor-pointer text-red-500 font-bold rounded-xl p-1"
          >
            {loading ? <LoadingSpinner className="" /> : <div>Log Out</div>}
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
