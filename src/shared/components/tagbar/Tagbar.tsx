import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate } from "react-router-dom";
import { Tag } from "lucide-react";

interface TagItem {
  id: string;
  name: string;
}

const TAGS: TagItem[] = [
  { id: "rpg", name: "Rol / RPG" },
  { id: "open-world", name: "Mundo Abierto" },
  { id: "action", name: "Acción" },
  { id: "coop", name: "Cooperativo" },
  { id: "nextgen", name: "Nueva Generación" },
];

export function Tagbar() {
  const { ref: containerRef } = useFocusable({
    focusKey: "TAGBAR_CONTAINER",
  });

  return (
    <div
      ref={containerRef}
      className="w-full bg-[#0c090c] border-t border-slate-900 p-4 px-8 flex items-center justify-between z-10"
    >
      <div className="flex items-center gap-3">
        <Tag className="size-5 text-purple-400" />
        <p className="font-extrabold text-sm tracking-wider uppercase text-slate-300">Etiquetas Populares:</p>
      </div>

      <div className="flex gap-4">
        {TAGS.map((tag) => (
          <TagPill key={tag.id} tag={tag} />
        ))}
      </div>

      <div className="text-xs text-slate-500 font-medium">
        Presiona <span className="font-bold text-slate-400">ENTER</span> en una etiqueta para buscar
      </div>
    </div>
  );
}

function TagPill({ tag }: { tag: TagItem }) {
  const navigate = useNavigate();
  const { ref, focused } = useFocusable({
    focusKey: `TAG_PILL_${tag.id}`,
    onEnterPress: () => {
      // Navigate to games catalog (could pass genre state)
      navigate("/games");
    },
  });

  return (
    <div
      ref={ref}
      className={`rounded-full px-4 py-1.5 border text-xs font-bold transition-all duration-200 outline-none cursor-pointer ${
        focused
          ? "bg-purple-600 text-white border-purple-500 scale-105 shadow-[0_0_10px_rgba(168,85,247,0.3)]"
          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
      }`}
    >
      {tag.name}
    </div>
  );
}
