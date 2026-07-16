import { useEffect, useRef, useState } from "react";
import { useFocusable, setFocus } from "@noriginmedia/norigin-spatial-navigation";
import { useDelayedFocus } from "../../shared/hooks/useDelayedFocus";
import { api, Game, Trailer } from "../../shared/services/api";
import { VideoPlayer } from "../../shared/components/player/VideoPlayer";
import { Search, Star, Play } from "lucide-react";

export function SearchView() {
  const inputRef = useRef<HTMLInputElement>(null!);
  const [query, setQuery] = useState("");
  const [games, setGames] = useState<Game[]>([]);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const delayedFocus = useDelayedFocus();

  const { ref: containerRef } = useFocusable({ focusKey: "SEARCH_CONTAINER" });

  const { ref: inputWrapperRef, focused: inputFocused } = useFocusable({
    focusKey: "SEARCH_INPUT",
    onEnterPress: () => inputRef.current?.focus(),
  });

  useEffect(() => {
    setFocus("SEARCH_INPUT");
    api.getFavorites().then((favs) => setFavorites(favs.map((f) => f.idJuego))).catch(() => {});
    api.getTrailers().then(setTrailers).catch(() => {});
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setGames([]);
      setSearched(false);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api.getGames({ search: query.trim() });
        setGames(data);
        setSearched(true);
        if (data.length > 0) delayedFocus(`SEARCH_GAME_${data[0].idJuego}`);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const handleToggleFavorite = async (gameId: string) => {
    try {
      const res = await api.toggleFavorite(gameId, favorites.includes(gameId));
      setFavorites((prev) =>
        res.favorited ? [...prev, gameId] : prev.filter((id) => id !== gameId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlay = (game: Game) => {
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

  return (
    <div className="flex flex-col gap-6 p-8 w-full">
      <div>
        <h1 className="text-4xl font-black text-white tracking-tight uppercase">Buscar</h1>
        <p className="text-slate-400 text-sm mt-1">Encuentra juegos por título.</p>
      </div>

      {/* Search input */}
      <div
        ref={inputWrapperRef}
        className={`flex items-center gap-4 p-4 rounded-2xl border bg-slate-900 transition-all duration-300 ${
          inputFocused ? "border-purple-500 ring-4 ring-purple-500/30" : "border-slate-700"
        }`}
      >
        <Search className="size-6 text-slate-400 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Escribe el nombre del juego..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent text-white placeholder-slate-500 text-lg outline-none"
        />
        {loading && (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500 flex-shrink-0" />
        )}
      </div>

      {/* Results */}
      {!query.trim() && (
        <p className="text-slate-500 text-center py-16">Escribe para buscar juegos...</p>
      )}

      {searched && games.length === 0 && !loading && (
        <p className="text-slate-500 text-center py-16">Sin resultados para "{query}".</p>
      )}

      {games.length > 0 && (
        <div ref={containerRef} className="grid grid-cols-4 gap-6 pb-24">
          {games.map((game) => (
            <SearchGameCard
              key={game.idJuego}
              game={game}
              isFavorite={favorites.includes(game.idJuego)}
              onToggleFavorite={() => handleToggleFavorite(game.idJuego)}
              onPlay={() => handlePlay(game)}
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
            if (games.length > 0) delayedFocus(`SEARCH_GAME_${games[0].idJuego}`);
          }}
        />
      )}
    </div>
  );
}

function SearchGameCard({
  game,
  isFavorite,
  onToggleFavorite,
  onPlay,
}: {
  game: Game;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPlay: () => void;
}) {
  const { ref, focused } = useFocusable({
    focusKey: `SEARCH_GAME_${game.idJuego}`,
    onEnterPress: () => onPlay(),
  });

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={`bg-slate-900 border rounded-2xl overflow-hidden flex flex-col transition-all duration-300 transform outline-none select-none relative ${
        focused
          ? "border-purple-500 ring-4 ring-purple-500/40 scale-105 shadow-[0_10px_20px_rgba(168,85,247,0.25)]"
          : "border-slate-800"
      }`}
    >
      <div className="h-64 relative overflow-hidden bg-slate-950">
        <img src={game.imagenPortada} alt={game.titulo} className="w-full h-full object-cover" />
        {focused && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-purple-600 p-4 rounded-full shadow-lg scale-110 animate-bounce">
              <Play className="size-8 fill-current" />
            </div>
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
            isFavorite ? "bg-purple-600 text-white" : "bg-black/50 text-slate-400"
          }`}
        >
          <Star className={`size-4 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>
      <div className="p-4 flex flex-col gap-1 flex-1">
        <h3 className="font-bold text-lg text-white leading-tight line-clamp-1">{game.titulo}</h3>
        <p className="text-xs text-slate-400 font-semibold">{game.desarrollador} • {game.fechaLanzamiento.split("-")[0]}</p>
        <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">{game.descripcion}</p>
      </div>
    </div>
  );
}
