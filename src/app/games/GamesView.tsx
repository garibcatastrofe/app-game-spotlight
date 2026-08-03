import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useDelayedFocus } from "../../shared/hooks/useDelayedFocus";
import {
  api,
  applyParentalFilter,
  Game,
  Trailer,
  UserSettings,
} from "../../shared/services/api";
import { VideoPlayer } from "../../shared/components/player/VideoPlayer";
import { Star, Play, X } from "lucide-react";

export function GamesView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const generoId = searchParams.get("generoId") ?? undefined;
  const plataformaId = searchParams.get("plataformaId") ?? undefined;
  const search = searchParams.get("search") ?? undefined;

  const delayedFocus = useDelayedFocus();

  const { ref: gridContainerRef } = useFocusable({
    focusKey: "GAMES_GRID_CONTAINER",
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
    setLoading(true);
    const loadData = async () => {
      try {
        const [gamesData, trailersData, favsData, settingsData] =
          await Promise.all([
            api.getGames({ generoId, plataformaId, search }),
            api.getTrailers().catch(() => [] as Trailer[]),
            api.getFavorites().catch(() => [] as { idJuego: string }[]),
            api.getSettings().catch(() => null),
          ]);
        if (isMounted) {
          console.log(`GamesView loaded data:`, {
            gamesData,
            trailersData,
            favsData,
          });
          setSettings(settingsData);
          setGames(applyParentalFilter(gamesData, settingsData));
          setTrailers(trailersData);
          setFavorites(favsData.map((f) => f.idJuego));
          setLoading(false);
          delayedFocus(
            gamesData.length > 0
              ? `GAMEROW_TOOGLE_FAVORITE_${gamesData[0].idJuego}`
              : "GAMES_CLEAR_FILTER",
          );
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
  }, [generoId, plataformaId, search]);

  const handleToggleFavorite = async (gameId: string) => {
    try {
      const res = await api.toggleFavorite(gameId, favorites.includes(gameId));
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
      urlVideo:
        "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_5MB.mp4",
      urlPoster: game.imagenPortada,
      duracionSegundos: 120,
      vistas: 1000,
    };
    setSelectedTrailer(trailer);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="w-12 h-12 border-b-2 border-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase">
            Catálogo de Juegos
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Explora los mejores videojuegos del mercado y reproduce sus trailers
            exclusivos.
          </p>
        </div>
        {(generoId || plataformaId || search) && (
          <ClearFilterButton onPress={() => navigate("/games")} />
        )}
      </div>

      {games.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-4 py-24">
          <p className="text-lg text-slate-500">
            Sin resultados para este filtro.
          </p>
          <ClearFilterButton onPress={() => navigate("/games")} />
        </div>
      ) : (
        <div ref={gridContainerRef} className="grid grid-cols-4 gap-6 pb-24">
          {games.map((game) => (
            <GameCard
              key={game.idJuego}
              game={game}
              isFavorite={favorites.includes(game.idJuego)}
              onToggleFavorite={() => handleToggleFavorite(game.idJuego)}
              onPlay={() => handlePlayGameTrailer(game)}
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
            delayedFocus(
              games.length > 0
                ? `GAMEROW_TOOGLE_FAVORITE_${games[0].idJuego}`
                : "SIDEBAR_/home",
            );
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

function GameCard({
  game,
  isFavorite,
  onToggleFavorite,
  onPlay,
}: GameCardProps) {
  /* const { ref, focused } = useFocusable({
    focusKey: `GAME_CARD_${game.idJuego}`,
    onEnterPress: () => onPlay(),
  }); */

  return (
    <div
      /* ref={ref}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "i" || e.keyCode === 405) {
          e.preventDefault();
          onToggleFavorite();
        }
      }} */
      className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 transform outline-none select-none relative`}
      /* ${
        focused
          ? "border-purple-500 ring-4 ring-purple-500/40 scale-105 shadow-[0_10px_20px_rgba(168,85,247,0.25)]"
          : "border-slate-800"
      } */
    >
      {/* Cover image container */}
      <div className="relative h-24 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/80 to-transparent"></div>
        <img
          src={game.imagenPortada}
          alt={game.titulo}
          className="z-0 object-cover w-full h-full transition-transform duration-500"
        />
        <div className="absolute z-20 top-4 right-4">
          <FavoriteIcon
            game={game}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
        {/* {focused && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 animate-fade-in">
            <div className="p-4 text-white scale-110 bg-purple-600 rounded-full shadow-lg animate-bounce">
              <Play className="fill-current size-8" />
            </div>
          </div>
        )} */}
        {/* Favorite badge (visual only) */}

        {/* Shortcut hint when focused */}
        {/* {focused && (
          <div className="absolute bottom-2 right-2 text-[9px] font-bold text-slate-300 bg-black/60 px-1.5 py-0.5 rounded">
            [i] ★
          </div>
        )} */}
      </div>

      {/* Card Info */}
      <div className="flex flex-col flex-1 gap-1 p-4">
        <div className="flex items-start justify-between gap-1">
          <h3 className="text-lg font-bold leading-tight text-white line-clamp-1">
            {game.titulo}
          </h3>
        </div>
        <p className="text-xs font-semibold text-slate-400">
          {game.desarrollador} • {game.fechaLanzamiento?.split("-")[0] ?? ""}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-2">
          {game.descripcion}
        </p>

        <ViewTrailerToogle game={game} onPlay={onPlay} />
      </div>

      
    </div>
  );
}

function FavoriteIcon({
  isFavorite,
  onToggleFavorite,
  game,
}: {
  isFavorite: boolean;
  onToggleFavorite: () => void;
  game: Game;
}) {
  const { ref, focused } = useFocusable({
    focusKey: `GAMEROW_TOOGLE_FAVORITE_${game.idJuego}`,
    onEnterPress: () => onToggleFavorite(),
    onFocus: () =>
      ref.current?.scrollIntoView({
        behavior: "smooth",
        inline: "nearest",
        block: "nearest",
      }),
  });

  useEffect(() => {
    if (focused) {
      (ref.current as HTMLElement)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [focused, ref]);

  return (
    <div className="z-20 flex justify-end outline-none" ref={ref} tabIndex={-1}>
      <div
        className={`p-1.5 rounded-full pointer-events-none transition-all duration-300 ring-4 ${focused ? "ring-purple-400" : "ring-transparent"} ${
          isFavorite ? "bg-amber-500 text-white" : "bg-black/50 text-slate-400"
        }`}
      >
        <Star className="size-3.5 fill-current" />
      </div>
    </div>
  );
}

function ViewTrailerToogle({
  onPlay,
  game,
}: {
  onPlay: () => void;
  game: Game;
}) {
  const { ref, focused } = useFocusable({
    focusKey: `GAMEROW_TOOGLE_PLAY_${game.idJuego}`,
    onEnterPress: () => onPlay(),
    onFocus: () =>
      ref.current?.scrollIntoView({
        behavior: "smooth",
        inline: "nearest",
        block: "nearest",
      }),
  });

  useEffect(() => {
    if (focused) {
      (ref.current as HTMLElement)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [focused, ref]);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={`py-1 rounded text-xs font-bold mt-1 flex items-center justify-center gap-1 transition-all duration-300 outline-none ${focused ? "bg-purple-500" : "bg-purple-500/20"}`}
    >
      <Play className="size-2.5 text-white" />{" "}
      <p className="text-white">Ver Trailer</p>
    </div>
  );
}

function ClearFilterButton({ onPress }: { onPress: () => void }) {
  const { ref, focused } = useFocusable({
    focusKey: "GAMES_CLEAR_FILTER",
    onEnterPress: onPress,
  });

  return (
    <button
      ref={ref}
      onClick={onPress}
      className={`flex items-center gap-2 text-sm border rounded-full px-4 py-2 transition-all duration-200 ${
        focused
          ? "bg-purple-600 border-purple-500 text-white scale-105"
          : "border-slate-700 text-slate-400"
      }`}
    >
      <X className="size-4" />
      Quitar filtro
    </button>
  );
}
