import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useDelayedFocus } from "../../shared/hooks/useDelayedFocus";
import { api, Genero } from "../../shared/services/api";
import { Gamepad2 } from "lucide-react";

export function GenresView() {
  const navigate = useNavigate();
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [loading, setLoading] = useState(true);

  const delayedFocus = useDelayedFocus();

  const { ref: containerRef } = useFocusable({
    focusKey: "GENRES_CONTAINER",
  });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Backspace") {
        e.preventDefault();
        navigate(-1);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [navigate]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await api.getGeneros();
        if (isMounted) {
          setGeneros(data);
          setLoading(false);
          if (data.length > 0) delayedFocus(`GENRE_CARD_${data[0].idGenero}`);
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
        <h1 className="text-4xl font-black text-white tracking-tight uppercase">Géneros</h1>
        <p className="text-slate-400 text-sm mt-1">Selecciona un género para filtrar el catálogo de juegos.</p>
      </div>

      <div ref={containerRef} className="grid grid-cols-4 gap-6 pb-24">
        {generos.map((genero) => (
          <GeneroCard key={genero.idGenero} genero={genero} />
        ))}
        {generos.length === 0 && (
          <p className="col-span-4 text-slate-500 text-center py-16">No hay géneros disponibles.</p>
        )}
      </div>
    </div>
  );
}

function GeneroCard({ genero }: { genero: Genero }) {
  const navigate = useNavigate();
  const { ref, focused } = useFocusable({
    focusKey: `GENRE_CARD_${genero.idGenero}`,
    onEnterPress: () => navigate(`/games?generoId=${genero.idGenero}`),
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
      {genero.iconoUrl ? (
        <img src={genero.iconoUrl} alt={genero.nombre} className="w-16 h-16 object-contain" />
      ) : (
        <div className={`p-4 rounded-full ${focused ? "bg-purple-600" : "bg-slate-800"} transition-colors duration-300`}>
          <Gamepad2 className="size-8 text-white" />
        </div>
      )}
      <p className="font-bold text-lg text-white text-center">{genero.nombre}</p>
      {genero.descripcion && (
        <p className="text-xs text-slate-400 text-center line-clamp-2">{genero.descripcion}</p>
      )}
    </div>
  );
}
