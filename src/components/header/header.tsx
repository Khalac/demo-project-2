import NavigationMenu from "./navigation-menu";
import { NumberNotificationUnread } from "@/features/leave-request/notification";
import UserAvatar from "./_components/user-avatar";

const Header = () => {
  return (
    <header className="flex justify-between items-center h-5 sm:h-10 py-6 px-3 sm:py-8 sm:px-5 bg-white shadow-2xs">
      <NavigationMenu />
      <div className="gap-5 flex">
        <NumberNotificationUnread />
        <UserAvatar />
      </div>
    </header>
  );
};

export default Header;
