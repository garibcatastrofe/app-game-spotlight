import { Gamepad2, Bell, Search } from "lucide-react";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../../services/api";
import user from "./images/userPhoto.jpg";

const links: { label: string; href: string }[] = [
  {
    label: "INICIO",
    href: "/home",
  },
  {
    label: "JUEGOS",
    href: "/games",
  },
  {
    label: "TRAILERS",
    href: "/trailers",
  },
  {
    label: "NOVEDADES",
    href: "/features",
  },
  {
    label: "MI LISTA",
    href: "/list",
  },
];

export function Navbar() {
  return (
    <div className="flex justify-between w-full p-4">
      <div className="flex">
        <Gamepad2 className="mr-6 text-purple-500 size-12 min-w-12 min-h-12" />
        <div className="flex flex-col">
          <p className="text-lg font-medium">GAME</p>
          <p className="text-sm">SPOTLIGHT</p>
        </div>
      </div>

      <div className="flex items-center justify-end">
        {links.map((link, index) => (
          <NavbarItem key={index} label={link.label} href={link.href} />
        ))}

        <SearchIcon />
        <BellIcon />
        <UserProfile />
      </div>
    </div>
  );
}

function NavbarItem({ label, href }: { label: string; href: string }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { ref, focused } = useFocusable({
    onEnterPress: () => {
      navigate(href);
    },
  });

  const linkClasses = (path: string) => {
    const isActive = pathname === path || pathname?.startsWith(`${path}/`);

    return `${isActive ? "border-b-purple-500" : "border-b-transparent"}`;
  };

  return (
    <div
      ref={ref}
      className={`ring-2 transition-all duration-300 py-2 px-4 rounded-xl flex items-center ${focused ? "ring-purple-500" : "ring-transparent"}`}
    >
      <p
        className={`border-b-2 transition-all duration-300 font-semibold ${linkClasses(href)}`}
      >
        {label}
      </p>
    </div>
  );
}

function SearchIcon() {
  const { ref, focused } = useFocusable({
    onEnterPress: () => {},
  });

  return (
    <div
      ref={ref}
      className={`p-2 rounded-full ring-2 transition-all duration-300 mx-4 ${focused ? "ring-purple-500" : "ring-transparent"}`}
    >
      <Search className="size-8 min-w-8 min-h-8" />
    </div>
  );
}

function BellIcon() {
  const { ref, focused } = useFocusable({
    onEnterPress: () => {},
  });

  return (
    <div
      ref={ref}
      className={`p-2 rounded-full ring-2 transition-all duration-300  ${focused ? "ring-purple-500" : "ring-transparent"}`}
    >
      <Bell className="size-8 min-w-8 min-h-8" />
    </div>
  );
}

function UserProfile() {
  const navigate = useNavigate();
  const { ref, focused } = useFocusable({
    onEnterPress: async () => {
      await api.logout();
      navigate("/");
    },
  });

  return (
    <img
      ref={ref}
      className={`min-w-8 min-h-8 w-8 h-8 rounded-full ring-2 transition-all duration-300 mx-4 ${focused ? "ring-purple-500" : "ring-transparent"}`}
      src={user}
      alt="Cerrar sesión"
    />
  );
}
