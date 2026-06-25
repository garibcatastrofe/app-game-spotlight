import { useEffect, useState } from "react";
import { useFocusable, setFocus } from "@noriginmedia/norigin-spatial-navigation";
import { api, Trailer } from "../../shared/services/api";
import { VideoPlayer } from "../../shared/components/player/VideoPlayer";
import { Play, Clock, Eye } from "lucide-react";

export function TrailersView() {
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>(null);
  const [loading, setLoading] = useState(true);

  const { ref: containerRef } = useFocusable({
    focusKey: "TRAILERS_GRID_CONTAINER",
  });

  useEffect(() => {
    let isMounted = true;
    const loadTrailers = async () => {
      try {
        const data = await api.getTrailers();
        if (isMounted) {
          setTrailers(data);
          setLoading(false);
          if (data.length > 0) {
            setTimeout(() => {
              setFocus(`TRAILER_GRID_CARD_${data[0].idTrailer}`);
            }, 100);
          }
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
      <div className="flex h-full w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-6 p-8 overflow-y-auto w-full">
      <div>
        <h1 className="text-4xl font-black text-white tracking-tight uppercase">Trailers Exclusivos</h1>
        <p className="text-slate-400 text-sm mt-1">Disfruta de los últimos avances de tus videojuegos favoritos en calidad premium.</p>
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

      {selectedTrailer && (
        <VideoPlayer
          videoUrl={selectedTrailer.urlVideo}
          title={`${selectedTrailer.juego?.titulo || "Video"} — ${selectedTrailer.titulo}`}
          onClose={() => {
            setSelectedTrailer(null);
            setTimeout(() => {
              if (trailers.length > 0) {
                setFocus(`TRAILER_GRID_CARD_${trailers[0].idTrailer}`);
              }
            }, 100);
          }}
        />
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
      className={`bg-slate-900 border rounded-2xl overflow-hidden flex flex-col transition-all duration-300 transform outline-none select-none relative ${
        focused
          ? "border-purple-500 ring-4 ring-purple-500/40 scale-105 shadow-[0_10px_20px_rgba(168,85,247,0.25)]"
          : "border-slate-800"
      }`}
    >
      {/* Thumbnail */}
      <div className="h-48 relative overflow-hidden bg-slate-950">
        <img
          src={trailer.urlPoster}
          alt={trailer.titulo}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Play Icon on Focus */}
        {focused && (
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center animate-fade-in">
            <div className="bg-purple-600 p-4 rounded-full text-white shadow-lg scale-110">
              <Play className="size-6 fill-current" />
            </div>
          </div>
        )}

        {/* Badges */}
        <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-xs text-slate-200 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
          <Clock className="size-3" />
          {Math.floor(trailer.duracionSegundos / 60)}:{(trailer.duracionSegundos % 60) < 10 ? "0" : ""}{trailer.duracionSegundos % 60}
        </span>

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
          <h3 className="font-bold text-base text-white leading-snug line-clamp-2 mt-1">{trailer.titulo}</h3>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mt-2">
          <Eye className="size-3.5" />
          <span>{formatViews(trailer.vistas)}</span>
        </div>
      </div>
    </div>
  );
}
