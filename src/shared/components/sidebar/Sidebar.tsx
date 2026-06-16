import {
  LucideIcon,
  House,
  Rocket,
  Clapperboard,
  Gamepad2,
  TvMinimal,
  Heart,
  Settings,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";

const links: { label: string; href: string; icon: LucideIcon }[] = [
  {
    label: "INICIO",
    href: "/home",
    icon: House,
  },
  {
    label: "PRÓXIMOS LANZAMIENTOS",
    href: "/launches",
    icon: Rocket,
  },
  {
    label: "TRAILERS EXCLUSIVOS",
    href: "/trailers",
    icon: Clapperboard,
  },
  {
    label: "GÉNEROS",
    href: "/genres",
    icon: Gamepad2,
  },
  {
    label: "PLATAFORMAS",
    href: "/platforms",
    icon: TvMinimal,
  },
  {
    label: "FAVORITOS",
    href: "/favorites",
    icon: Heart,
  },
  {
    label: "AJUSTES",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  return (
    <div className="px-6 pt-8 w-72 min-w-72">
      {links.map((link, index) => (
        <SidebarItem
          key={index}
          label={link.label}
          href={link.href}
          icon={link.icon}
        />
      ))}
    </div>
  );
}

function SidebarItem({
  label,
  href,
  icon: Icon,
}: {
  label: string;
  href: string;
  icon: LucideIcon;
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { ref, focused } = useFocusable({
    onEnterPress: () => {
      navigate(href);
    },
  });

  const linkClasses = (path: string) => {
    const isActive = pathname === path || pathname?.startsWith(`${path}/`);

    return `${isActive ? "bg-gradient-to-r from-purple-500 to-purple-700" : "bg-gradient-to-r from-transparent to-transparent"}`;
  };

  return (
    <div
      ref={ref}
      className={`ring-2 transition-all duration-300 py-2 px-4 rounded-xl flex items-center mb-2 ${linkClasses(href)} ${focused ? "ring-purple-500" : "ring-transparent"}`}
    >
      <Icon className="mr-4 size-6 min-w-6 min-h-6" />
      <p className="text-sm font-semibold">{label}</p>
    </div>
  );
}
