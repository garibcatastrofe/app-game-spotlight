import { LucideIcon } from "lucide-react";
import { Star, Gem, Bell, Heart } from "lucide-react";

interface TagItem {
  icon: LucideIcon;
  label: string;
  description: string;
}

const TAGS: TagItem[] = [
  {
    icon: Gem,
    label: "TRAILERS EXCLUSIVOS",
    description: "Contenido único de cada lanzamiento",
  },
  {
    icon: Star,
    label: "ESTRENOS DESTACADOS",
    description: "No te pierdas los juegos más esperados",
  },
  {
    icon: Bell,
    label: "ALERTAS PERSONALIZADAS",
    description: "Recibe notificaciones de tus juegos favoritos",
  },
  {
    icon: Heart,
    label: "TU LISTA, TU MUNDO",
    description: "Guarda y organiza los juegos que más te interesan",
  },
];

export function Tagbar() {
  return (
    <div className="w-full bg-gradient-to-b from-[#0b0b23] to-[#080815] p-4 px-8 flex items-center justify-center gap-6">
      {TAGS.map((tag, index) => (
        <Tag key={index} tag={tag} />
      ))}
    </div>
  );
}

function Tag({ tag }: { tag: TagItem }) {
  return (
    <div className="flex items-center gap-6">
      <tag.icon className="text-purple-500 size-12 min-h-12 min-w-12" />

      <div className="flex flex-col justify-center gap-1">
        <p className="font-bold text-slate-100">{tag.label}</p>
        <p className="text-sm text-slate-400 max-w-48">{tag.description}</p>
      </div>
    </div>
  );
}
