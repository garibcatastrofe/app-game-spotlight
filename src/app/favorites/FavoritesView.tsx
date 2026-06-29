import { useEffect, useState } from "react";
import { useFocusable, setFocus } from "@noriginmedia/norigin-spatial-navigation";
import { api, Game, Trailer } from "../../shared/services/api";
import { VideoPlayer } from "../../shared/components/player/VideoPlayer";
import { Star, Play, HeartCrack } from "lucide-react";

export function FavoritesView() {
  const [favorites, setFavorites] = useState<Game[]>([]);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>(null);
  const [loading, setLoading] = useState(true);

  const { ref: containerRef } = useFocusable({
    focusKey: "FAVORITES_GRID_CONTAINER",
  });

  useEffect(() => {
    let isMounted = true;
    const loadFavs = async () => {
      try {
        const [favsData, trailersData] = await Promise.all([
          api.getFavorites(),
          api.getTrailers(),
        ]);
        if (isMounted) {
          setFavorites(favsData);
          setTrailers(trailersData);
          setLoading(false);
          if (favsData.length > 0) {
            setTimeout(() => {
              setFocus(`FAV_CARD_${favsData[0].idJuego}`);
            }, 100);
          }
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setLoading(false);
      }
    };
    loadFavs();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRemoveFavorite = async (gameId: string) => {
    try {
      await api.toggleFavorite(gameId, true);
      setFavorites((prev) => prev.filter((g) => g.idJuego !== gameId));
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlayTrailer = (game: Game) => {
    const trailer = trailers.find((t) => t.idJuego === game.idJuego) || {
      idTrailer: "temp",
      idJuego: game.idJuego,
      titulo: `Tráiler de ${game.titulo}`,
      tipo: "Gameplay",
      urlVideo: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_5MB.mp4",
      urlPoster: game.imagenPortada,
      duracionSegundos: 120,
      vistas: 1000,
    };
    setSelectedTrailer(trailer);
  };

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
        <h1 className="text-4xl font-black text-white tracking-tight uppercase">Mi Lista / Favoritos</h1>
        <p className="text-slate-400 text-sm mt-1">Tus videojuegos marcados como favoritos para acceso rápido.</p>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 gap-4 border border-dashed border-slate-800 rounded-3xl p-12 bg-slate-900/10">
          <Star className="size-16 text-slate-700 animate-pulse" />
          <p className="text-slate-400 font-semibold text-lg text-center">Aún no has agregado juegos a tu lista.</p>
          <p className="text-slate-600 text-sm text-center">Explora el catálogo y marca juegos con la estrella.</p>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="grid grid-cols-4 gap-6 pb-24"
        >
          {favorites.map((game) => (
            <FavoriteCard
              key={game.idJuego}
              game={game}
              onRemove={() => handleRemoveFavorite(game.idJuego)}
              onPlay={() => handlePlayTrailer(game)}
            />
          ))}
        </div>
      )}

      {selectedTrailer && (
        <VideoPlayer
          videoUrl={selectedTrailer.urlVideo}
          title={`${selectedTrailer.juego?.titulo || "Juego"} — ${selectedTrailer.titulo}`}
          onClose={() => {
            setSelectedTrailer(null);
            setTimeout(() => {
              if (favorites.length > 0) {
                setFocus(`FAV_CARD_${favorites[0].idJuego}`);
              }
            }, 100);
          }}
        />
      )}
    </div>
  );
}

interface FavoriteCardProps {
  game: Game;
  onRemove: () => void;
  onPlay: () => void;
}

function FavoriteCard({ game, onRemove, onPlay }: FavoriteCardProps) {
  const { ref, focused } = useFocusable({
    focusKey: `FAV_CARD_${game.idJuego}`,
    onEnterPress: () => onPlay(),
  });

  return (
    <div
      ref={ref}
      className={`bg-slate-900 border rounded-2xl overflow-hidden flex flex-col transition-all duration-300 transform outline-none select-none relative ${
        focused
          ? "border-purple-500 ring-4 ring-purple-500/40 scale-105 shadow-[0_10px_20px_rgba(168,85,247,0.25)]"
          : "border-slate-800"
      }`}
    >
      {/* Cover image container */}
      <div className="h-64 relative overflow-hidden bg-slate-950">
        <img
          src={game.imagenPortada}
          alt={game.titulo}
          className="w-full h-full object-cover"
        />
        {/* Play icon overlay on focus */}
        {focused && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center animate-fade-in text-white gap-2 flex-col">
            <div className="bg-purple-600 p-4 rounded-full shadow-lg scale-110">
              <Play className="size-6 fill-current" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">Ver Trailer</span>
          </div>
        )}
        
        {/* Remove Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-red-400 hover:text-red-500 hover:bg-black/70 transition-all duration-200"
          title="Quitar de favoritos"
        >
          <HeartCrack className="size-4" />
        </button>
      </div>

      {/* Card Info */}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <h3 className="font-bold text-base text-white leading-tight line-clamp-1">{game.titulo}</h3>
        <p className="text-xs text-slate-400 font-semibold">{game.desarrollador} • {game.fechaLanzamiento.split("-")[0]}</p>
      </div>
    </div>
  );
}
