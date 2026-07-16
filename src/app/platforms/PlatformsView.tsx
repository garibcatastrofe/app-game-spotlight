import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useDelayedFocus } from "../../shared/hooks/useDelayedFocus";
import { api, Plataforma } from "../../shared/services/api";
import { TvMinimal } from "lucide-react";

export function PlatformsView() {
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
  const [loading, setLoading] = useState(true);

  const delayedFocus = useDelayedFocus();

  const { ref: containerRef } = useFocusable({
    focusKey: "PLATFORMS_CONTAINER",
  });

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await api.getPlataformas();
        if (isMounted) {
          setPlataformas(data);
          setLoading(false);
          if (data.length > 0) delayedFocus(`PLATFORM_CARD_${data[0].idPlataforma}`);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-8 w-full">
      <div>
        <h1 className="text-4xl font-black text-white tracking-tight uppercase">Plataformas</h1>
        <p className="text-slate-400 text-sm mt-1">Selecciona una plataforma para filtrar el catálogo de juegos.</p>
      </div>

      <div ref={containerRef} className="grid grid-cols-4 gap-6 pb-24">
        {plataformas.map((plataforma) => (
          <PlataformaCard key={plataforma.idPlataforma} plataforma={plataforma} />
        ))}
        {plataformas.length === 0 && (
          <p className="col-span-4 text-slate-500 text-center py-16">No hay plataformas disponibles.</p>
        )}
      </div>
    </div>
  );
}

function PlataformaCard({ plataforma }: { plataforma: Plataforma }) {
  const navigate = useNavigate();
  const { ref, focused } = useFocusable({
    focusKey: `PLATFORM_CARD_${plataforma.idPlataforma}`,
    onEnterPress: () => navigate(`/games?plataformaId=${plataforma.idPlataforma}`),
  });

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={`bg-slate-900 border rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-4 p-8 transition-all duration-300 cursor-pointer select-none ${
        focused
          ? "border-purple-500 ring-4 ring-purple-500/40 scale-105 shadow-[0_10px_20px_rgba(168,85,247,0.25)]"
          : "border-slate-800"
      }`}
    >
      {plataforma.iconoUrl ? (
        <img src={plataforma.iconoUrl} alt={plataforma.nombre} className="w-16 h-16 object-contain" />
      ) : (
        <div className={`p-4 rounded-full ${focused ? "bg-purple-600" : "bg-slate-800"} transition-colors duration-300`}>
          <TvMinimal className="size-8 text-white" />
        </div>
      )}
      <p className="font-bold text-lg text-white text-center">{plataforma.nombre}</p>
      {plataforma.tipo && (
        <span className="text-xs text-slate-400 border border-slate-700 rounded-full px-3 py-1">{plataforma.tipo}</span>
      )}
    </div>
  );
}
