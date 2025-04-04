import { HEADERNAVIGATE } from "./constant";
import { NavLink } from "react-router-dom";
import { useAppDispatch } from "@/hook/redux-hook";
import { logOut } from "@/features/slice";
import { useNavigate } from "react-router-dom";
import { tryCatch } from "@/utils";
import { useState } from "react";
import { LoadingSpinner } from "../ui";
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
    <header className="w-full flex justify-center items-center gap-10 h-10 pt-5">
      {HEADERNAVIGATE.map((e) => {
        return (
          <NavLink
            to={e.path}
            key={e.id}
            className={({ isActive }) => (isActive ? "text-red-600" : "")}
          >
            {e.name}
          </NavLink>
        );
      })}
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
