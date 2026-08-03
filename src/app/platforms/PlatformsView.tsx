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
          if (data.length > 0)
            delayedFocus(`PLATFORM_CARD_${data[0].idPlataforma}`);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="w-12 h-12 border-b-2 border-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-6 p-8">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-white uppercase">
          Plataformas
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Selecciona una plataforma para filtrar el catálogo de juegos.
        </p>
      </div>

      <div ref={containerRef} className="grid grid-cols-4 gap-6 pb-24">
        {plataformas.map((plataforma) => (
          <PlataformaCard
            key={plataforma.idPlataforma}
            plataforma={plataforma}
          />
        ))}
        {plataformas.length === 0 && (
          <p className="col-span-4 py-16 text-center text-slate-500">
            No hay plataformas disponibles.
          </p>
        )}
      </div>
    </div>
  );
}

function PlataformaCard({ plataforma }: { plataforma: Plataforma }) {
  const navigate = useNavigate();
  const { ref, focused } = useFocusable({
    focusKey: `PLATFORM_CARD_${plataforma.idPlataforma}`,
    onEnterPress: () =>
      navigate(`/games?plataformaId=${plataforma.idPlataforma}`),
  });

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={`bg-slate-900 outline-none ring-4 rounded-2xl overflow-hidden flex flex-col items-center justify-end gap-4 px-8 pb-8 pt-24 transition-all duration-300 cursor-pointer select-none relative ${
        focused ? "ring-purple-500" : "ring-transparent"
      }`}
    >
      {plataforma.iconoUrl ? (
        <img
          src={plataforma.iconoUrl}
          alt={plataforma.nombre}
          className={`absolute inset-0 z-0 object-cover transition-all duration-300 ${focused ? "scale-110" : "scale-100"}`}
        />
      ) : (
        <div
          className={`p-4 rounded-full ${focused ? "bg-purple-600" : "bg-slate-800"} transition-colors duration-300`}
        >
          <TvMinimal className="text-white size-8" />
        </div>
      )}

      {plataforma.iconoUrl && (
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 to-transparent" />
      )}

      <div className="z-20 flex flex-col gap-2">
        <p className="text-xl font-bold text-center text-white">
          {plataforma.nombre}
        </p>
        <p className="text-sm text-center text-slate-200 line-clamp-2">
          {plataforma.tipo}
        </p>
      </div>
    </div>
  );
}
