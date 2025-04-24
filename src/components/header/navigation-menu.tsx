import { NavLink } from "react-router-dom";
import { cn } from "@/lib";
import { useAppSelector } from "@/hook/redux-hook";
const HEADERNAVIGATE = [
  {
    id: "dashboard",
    path: "/",
    name: "Dashboard",
  },
  {
    id: "employees",
    path: "/employees",
    name: "Employees",
    roles: ["MANAGER", "HR"],
  },
];

const NavigationMenu = () => {
  const user = useAppSelector((state) => state.user.user);
  const filterNavigate = HEADERNAVIGATE.filter((nav) => {
    if (!nav.roles) return true;
    return nav.roles.includes(user.role);
  });
  return (
    <div className="flex sm:gap-10 gap-5">
      {filterNavigate.map((e) => {
        return (
          <NavLink
            to={e.path}
            key={e.id}
            className={({ isActive }) => cn("", isActive && "text-[#3A5FBE]")}
          >
            {e.name}
          </NavLink>
        );
      })}
    </div>
  );
};

export default NavigationMenu;
