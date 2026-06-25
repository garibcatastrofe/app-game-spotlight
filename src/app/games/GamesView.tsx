import { useEffect, useState } from "react";
import { useFocusable, setFocus } from "@noriginmedia/norigin-spatial-navigation";
import { api, Game, Trailer } from "../../shared/services/api";
import { VideoPlayer } from "../../shared/components/player/VideoPlayer";
import { Star, Play } from "lucide-react";

export function GamesView() {
  const [games, setGames] = useState<Game[]>([]);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>(null);
  const [loading, setLoading] = useState(true);

  // Focus parent container
  const { ref: gridContainerRef } = useFocusable({
    focusKey: "GAMES_GRID_CONTAINER",
  });

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [gamesData, trailersData, favsData] = await Promise.all([
          api.getGames(),
          api.getTrailers(),
          api.getFavorites(),
        ]);
        if (isMounted) {
          setGames(gamesData);
          setTrailers(trailersData);
          setFavorites(favsData.map((f) => f.idJuego));
          setLoading(false);
          // Set focus on first card once loaded
          if (gamesData.length > 0) {
            setTimeout(() => {
              setFocus(`GAME_CARD_${gamesData[0].idJuego}`);
            }, 100);
          }
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleFavorite = async (e: React.MouseEvent | undefined, gameId: string) => {
    if (e) e.stopPropagation();
    try {
      const res = await api.toggleFavorite(gameId);
      if (res.favorited) {
        setFavorites((prev) => [...prev, gameId]);
      } else {
        setFavorites((prev) => prev.filter((id) => id !== gameId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlayGameTrailer = (game: Game) => {
    // Find matching trailer
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">Catálogo de Juegos</h1>
          <p className="text-slate-400 text-sm mt-1">Explora los mejores videojuegos del mercado y reproduce sus trailers exclusivos.</p>
        </div>
      </div>

      <div
        ref={gridContainerRef}
        className="grid grid-cols-4 gap-6 pb-24"
      >
        {games.map((game) => (
          <GameCard
            key={game.idJuego}
            game={game}
            isFavorite={favorites.includes(game.idJuego)}
            onToggleFavorite={() => handleToggleFavorite(undefined, game.idJuego)}
            onPlay={() => handlePlayGameTrailer(game)}
          />
        ))}
      </div>

      {selectedTrailer && (
        <VideoPlayer
          videoUrl={selectedTrailer.urlVideo}
          title={`${selectedTrailer.juego?.titulo || "Juego"} — ${selectedTrailer.titulo}`}
          onClose={() => {
            setSelectedTrailer(null);
            // Restore focus to games list
            setTimeout(() => {
              if (games.length > 0) {
                setFocus(`GAME_CARD_${games[0].idJuego}`);
              }
            }, 100);
          }}
        />
      )}
    </div>
  );
}

interface GameCardProps {
  game: Game;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPlay: () => void;
}

function GameCard({ game, isFavorite, onToggleFavorite, onPlay }: GameCardProps) {
  const { ref, focused } = useFocusable({
    focusKey: `GAME_CARD_${game.idJuego}`,
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
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {/* Play icon overlay on focus */}
        {focused && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center animate-fade-in">
            <div className="bg-purple-600 p-4 rounded-full text-white shadow-lg scale-110 animate-bounce">
              <Play className="size-8 fill-current" />
            </div>
          </div>
        )}
        
        {/* Favorite Badge */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
            isFavorite ? "bg-purple-600 text-white" : "bg-black/50 text-slate-400 hover:text-white"
          }`}
        >
          <Star className={`size-4 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Card Info */}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <div className="flex justify-between items-start gap-1">
          <h3 className="font-bold text-lg text-white leading-tight line-clamp-1">{game.titulo}</h3>
        </div>
        <p className="text-xs text-slate-400 font-semibold">{game.desarrollador} • {game.fechaLanzamiento.split("-")[0]}</p>
        <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">{game.descripcion}</p>
      </div>
    </div>
  );
}
