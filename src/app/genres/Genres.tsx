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
          Géneros
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Selecciona un género para filtrar el catálogo de juegos.
        </p>
      </div>

      <div ref={containerRef} className="grid grid-cols-4 gap-6 pb-24">
        {generos.map((genero) => (
          <GeneroCard key={genero.idGenero} genero={genero} />
        ))}
        {generos.length === 0 && (
          <p className="col-span-4 py-16 text-center text-slate-500">
            No hay géneros disponibles.
          </p>
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
      className={`bg-slate-900 outline-none ring-4 rounded-2xl overflow-hidden flex flex-col items-center justify-end gap-4 px-8 pb-8 pt-24 transition-all duration-300 cursor-pointer select-none relative ${
        focused
          ? "ring-purple-500"
          : "ring-transparent"
      }`}
    >
      {genero.iconoUrl ? (
        <img
          src={genero.iconoUrl}
          alt={genero.nombre}
          className={`absolute inset-0 z-0 object-cover transition-all duration-300 ${focused ? "scale-110" : "scale-100"}`}
        />
      ) : (
        <div
          className={`p-4 rounded-full ${focused ? "bg-purple-600" : "bg-slate-800"} transition-colors duration-300`}
        >
          <Gamepad2 className="text-white size-8" />
        </div>
      )}

      {genero.iconoUrl && (
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 to-transparent" />
      )}

      <div className="z-20 flex flex-col gap-2">
        <p className="text-xl font-bold text-center text-white">
          {genero.nombre}
        </p>
        {genero.descripcion && (
          <p className="text-sm text-center text-slate-200 line-clamp-2">
            {genero.descripcion}
          </p>
        )}
      </div>
    </div>
  );
}
