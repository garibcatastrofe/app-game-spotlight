import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useEffect } from "react";

export function Tagbar() {
  return (
    <div className="w-full h-48 p-4">
      <p className="mb-4 font-semibold">ETIQUETAS</p>

      <div className="flex">
        {Array.from({ length: 4 }).map((_, i) => (
          <HomeCard index={i} />
        ))}
      </div>
    </div>
  );
}

function HomeCard({ index }: { index: number }) {
  const { ref, focused } = useFocusable();

  useEffect(() => {
    if (focused && ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [focused, ref]);

  return (
    <div
      ref={ref}
      className={`bg-mauve-700 rounded-2xl p-4 flex flex-col gap-2 ring-2 transition-all duration-300 bg-slate-900 mx-4 min-w-48 ${focused ? "ring-purple-500" : "ring-transparent"}`}
    >
      <p className="text-lg font-bold">Card</p>
      <p className="text-sm text-mauve-400">Número {index + 1}</p>
    </div>
  );
}
