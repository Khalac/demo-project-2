import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  LoadingSpinner,
} from "@/components/ui";
import { logOut } from "@/features/auth/slice";
import { useAppSelector } from "@/hook/redux-hook";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hook/redux-hook";
import { tryCatch } from "@/utils";
const UserAvatar = () => {
  const user = useAppSelector((state) => state.user.user);
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    setLoading(true);
    const { data, error } = await tryCatch(dispatch(logOut()).unwrap());
    if (error) {
      setLoading(false);
      setError(error.message);
    }
    if (data?.success) {
      setLoading(false);
      navigate("/login");
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar>
          <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleLogout}>
          <button className="cursor-pointer text-red-500 font-bold rounded-xl p-1">
            {loading ? <LoadingSpinner className="" /> : <div>Log Out</div>}
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
