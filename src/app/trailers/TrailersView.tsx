import { useEffect, useState } from "react";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useDelayedFocus } from "../../shared/hooks/useDelayedFocus";
import { api, applyParentalFilter, applyParentalFilterToTrailers, Trailer } from "../../shared/services/api";
import { VideoPlayer } from "../../shared/components/player/VideoPlayer";
import { Play, Clock, Eye } from "lucide-react";

export function TrailersView() {
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>(null);
  const [loading, setLoading] = useState(true);

  const delayedFocus = useDelayedFocus();

  const { ref: containerRef } = useFocusable({
    focusKey: "TRAILERS_GRID_CONTAINER",
  });

  useEffect(() => {
    let isMounted = true;
    const loadTrailers = async () => {
      try {
        const [trailersData, gamesData, settingsData] = await Promise.all([
          api.getTrailers(),
          api.getGames(),
          api.getSettings().catch(() => null),
        ]);
        const filteredGames = applyParentalFilter(gamesData, settingsData);
        const allowedIds = settingsData?.controlParental
          ? new Set(filteredGames.map((g) => g.idJuego))
          : new Set<string>();
        const filtered = applyParentalFilterToTrailers(trailersData, allowedIds);
        if (isMounted) {
          setTrailers(filtered);
          setLoading(false);
          delayedFocus(filtered.length > 0 ? `TRAILER_GRID_CARD_${filtered[0].idTrailer}` : "SIDEBAR_/trailers");
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setLoading(false);
      }
    };
    loadTrailers();
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
        <h1 className="text-4xl font-black tracking-tight text-white uppercase">Trailers Exclusivos</h1>
        <p className="mt-1 text-sm text-slate-400">Disfruta de los últimos avances de tus videojuegos favoritos en calidad premium.</p>
      </div>

      <div
        ref={containerRef}
        className="grid grid-cols-3 gap-6 pb-24"
      >
        {trailers.map((trailer) => (
          <TrailerGridCard
            key={trailer.idTrailer}
            trailer={trailer}
            onPlay={() => setSelectedTrailer(trailer)}
          />
        ))}
      </div>

      {selectedTrailer && selectedTrailer.urlVideo && (
        <VideoPlayer
          videoUrl={selectedTrailer.urlVideo}
          title={`${selectedTrailer.juego?.titulo || "Video"} — ${selectedTrailer.titulo}`}
          onClose={() => {
            setSelectedTrailer(null);
            delayedFocus(trailers.length > 0 ? `TRAILER_GRID_CARD_${trailers[0].idTrailer}` : "SIDEBAR_/trailers");
          }}
        />
      )}
      {selectedTrailer && !selectedTrailer.urlVideo && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/80"
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Backspace") {
              setSelectedTrailer(null);
              delayedFocus(trailers.length > 0 ? `TRAILER_GRID_CARD_${trailers[0].idTrailer}` : "SIDEBAR_/trailers");
            }
          }}
          tabIndex={-1}
        >
          <p className="text-lg text-slate-400">Video no disponible</p>
          <p className="text-sm text-slate-500">Pulsa <span className="font-bold text-slate-300">BACK</span> o <span className="font-bold text-slate-300">ESC</span> para volver</p>
        </div>
      )}
    </div>
  );
}

interface TrailerGridCardProps {
  trailer: Trailer;
  onPlay: () => void;
}

function TrailerGridCard({ trailer, onPlay }: TrailerGridCardProps) {
  const { ref, focused } = useFocusable({
    focusKey: `TRAILER_GRID_CARD_${trailer.idTrailer}`,
    onEnterPress: () => onPlay(),
  });

  const formatViews = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M de vistas`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K de vistas`;
    return `${count} vistas`;
  };

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={`bg-slate-900 ring-4 border rounded-2xl overflow-hidden flex flex-col transition-all duration-300 transform outline-none select-none relative ${
        focused
          ? "border-purple-500 ring-purple-500"
          : "border-slate-800 ring-transparent"
      }`}
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-slate-950">
        <img
          src={trailer.urlPoster ?? undefined}
          alt={trailer.titulo}
          className={`object-cover w-full h-full transition-all duration-300 ${focused ? "scale-110" : "scale-100"}`}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Play Icon on Focus */}
        {focused && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55 animate-fade-in">
            <div className="p-4 text-white scale-110 bg-purple-600 rounded-full shadow-lg">
              <Play className="fill-current size-6" />
            </div>
          </div>
        )}

        {/* Badges */}
        {/* <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-xs text-slate-200 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
          <Clock className="size-3" />
          {Math.floor(trailer.duracionSegundos / 60)}:{(trailer.duracionSegundos % 60) < 10 ? "0" : ""}{trailer.duracionSegundos % 60}
        </span> */}

        <span className="absolute top-3 left-3 bg-purple-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
          {trailer.tipo}
        </span>
      </div>

      {/* Info details */}
      <div className="p-4 flex flex-col gap-1.5 flex-1 justify-between">
        <div>
          <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest leading-none">
            {trailer.juego?.titulo || "Video"}
          </span>
          <h3 className="mt-1 text-base font-bold leading-snug text-white line-clamp-2">{trailer.titulo}</h3>
        </div>

        {/* <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-slate-400">
          <Eye className="size-3.5" />
          <span>{formatViews(trailer.vistas)}</span>
        </div> */}
      </div>
    </div>
  );
}
