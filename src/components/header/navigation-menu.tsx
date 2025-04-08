import { NavLink } from "react-router-dom";
import { cn } from "@/lib";
const HEADERNAVIGATE = [
  {
    id: "dashboard",
    path: "/",
    name: "Dashboard",
  },
];

const NavigationMenu = () => {
  return (
    <div className="flex gap-10">
      {HEADERNAVIGATE.map((e) => {
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
