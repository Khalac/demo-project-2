import { useAppDispatch } from "@/hook/redux-hook";
import { logOut } from "@/features/slice";
import { useNavigate } from "react-router-dom";
import { tryCatch } from "@/utils";
import { useState } from "react";
import { LoadingSpinner } from "../ui";
import NavigationMenu from "./navigation-menu";
const Header = () => {
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
    <header className="flex justify-between items-center h-10 py-8 px-5 bg-white shadow-2xs">
      <NavigationMenu />
      <button
        className="cursor-pointer bg-red-500 text-white font-bold rounded-xl p-1"
        onClick={handleLogout}
      >
        {loading ? <LoadingSpinner className="" /> : <div>Log Out</div>}
      </button>
      {error && <div className="text-red-600 font-bold">{error}</div>}
    </header>
  );
};

export default Header;
