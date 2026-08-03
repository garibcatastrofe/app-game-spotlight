import { Gamepad2, Bell, Search, Settings } from "lucide-react";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  return (
    <div className="flex justify-between w-full p-4">
      <div className="flex items-center gap-4">
        <Gamepad2 className="text-purple-500 size-12 min-w-12 min-h-12" />
        <div className="flex flex-col">
          <p className="text-2xl font-bold leading-5 text-white">GAME</p>
          <p className="font-semibold text-white">SPOTLIGHT</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <SearchIcon />
        <BellIcon />
        <UserProfile />
      </div>
    </div>
  );
}

function SearchIcon() {
  const navigate = useNavigate();
  const { ref, focused } = useFocusable({
    onEnterPress: () => navigate("/search"),
  });

  return (
    <div
      ref={ref}
      className={`p-2 rounded-full ring-2 transition-all duration-300 ${focused ? "ring-purple-500" : "ring-transparent"}`}
    >
      <Search className="size-8 min-w-8 min-h-8" />
    </div>
  );
}

function BellIcon() {
  const navigate = useNavigate();
  const { ref, focused } = useFocusable({
    onEnterPress: () => navigate("/notifications"),
  });

  return (
    <div
      ref={ref}
      className={`p-2 rounded-full ring-2 transition-all duration-300 ${focused ? "ring-purple-500" : "ring-transparent"}`}
    >
      <Bell className="size-8 min-w-8 min-h-8" />
    </div>
  );
}

function UserProfile() {
  const navigate = useNavigate();
  const { ref, focused } = useFocusable({
    onEnterPress: async () => {
      navigate("/settings");
    },
  });

  return (
    <div
      ref={ref}
      className={`p-2 rounded-full ring-2 transition-all duration-300 ${focused ? "ring-purple-500" : "ring-transparent"}`}
    >
      <Settings className="size-8 min-w-8 min-h-8" />
    </div>
  );
}
