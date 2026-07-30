import { useEffect, useState } from "react";
import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useDelayedFocus } from "../../shared/hooks/useDelayedFocus";
import { api, Game, Trailer, UpcomingLaunch } from "../../shared/services/api";
import { VideoPlayer } from "../../shared/components/player/VideoPlayer";
import { Play, Plus, Check, Star } from "lucide-react";

export function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [launches, setLaunches] = useState<UpcomingLaunch[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [featuredGame, setFeaturedGame] = useState<Game | null>(null);
  const [featuredTrailer, setFeaturedTrailer] = useState<Trailer | null>(null);
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>(null);
  const [loading, setLoading] = useState(true);

  const delayedFocus = useDelayedFocus();

  // Focus parent container
  const { ref: containerRef } = useFocusable({
    focusKey: "HOME_CONTAINER",
  });

  const { ref: loadingRef } = useFocusable({ focusKey: "HOME_LOADING" });

  useEffect(() => {
    let isMounted = true;
    const loadHomeData = async () => {
      try {
        const [gamesData, trailersData, launchesData, favsData] =
          await Promise.all([
            api.getGames(),
            api.getTrailers(),
            api.getUpcomingLaunches(),
            api.getFavorites(),
          ]);

        if (isMounted) {
          setGames(gamesData);
          setTrailers(trailersData);
          setLaunches(launchesData);
          setFavorites(favsData.map((f) => f.idJuego));

          // Determine featured game (Elden Ring as default seed, or any featured)
          const featured =
            gamesData.find((g) => g.destacado) || gamesData[0] || null;
          setFeaturedGame(featured);

          if (featured) {
            const trailer =
              trailersData.find((t) => t.idJuego === featured.idJuego) ||
              trailersData[0] ||
              null;
            setFeaturedTrailer(trailer);
          }

          setLoading(false);
          delayedFocus("BANNER_PLAY_BTN");
        }
      } catch (err) {
        console.error("Error loading home page data:", err);
        if (isMounted) {
          setLoading(false);
          delayedFocus("SIDEBAR_/home", 80);
        }
      }
    };

    loadHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="w-12 h-12 border-b-2 border-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const isFeaturedFavorite = featuredGame
    ? favorites.includes(featuredGame.idJuego)
    : false;

  return (
    <div ref={containerRef} className="flex flex-col w-full select-none">
      {/* Banner / Hero Section with Loop Video */}
      {featuredGame && (
        <HeroBanner
          game={featuredGame}
          trailer={featuredTrailer}
          isFavorite={isFeaturedFavorite}
          onToggleFavorite={() => handleToggleFavorite(featuredGame.idJuego)}
          onPlayTrailer={(t) => setSelectedTrailer(t)}
        />
      )}

      {/* Rows Container */}
      <div className="flex flex-col gap-8 px-8 py-6 bg-gradient-to-t from-[#0c090c] to-transparent -mt-20 relative z-10">
        {/* Row 1: Trailers */}
        <div className="flex flex-col">
          <h2 className="mb-4 text-xl font-bold tracking-wider uppercase text-slate-100">
            Trailers Recientes
          </h2>
          <div className="flex gap-4 p-4 overflow-x-auto">
            {trailers.map((t) => (
              <TrailerCard
                key={t.idTrailer}
                trailer={t}
                onPlay={(tr) => setSelectedTrailer(tr)}
              />
            ))}
          </div>
        </div>

        {/* Row 2: Games */}
        <div className="flex flex-col">
          <h2 className="mb-4 text-xl font-bold tracking-wider uppercase text-slate-100">
            Catálogo Destacado
          </h2>
          <div className="flex gap-4 p-4 overflow-x-auto">
            {games.map((g) => (
              <GameRowCard
                key={g.idJuego}
                game={g}
                isFavorite={favorites.includes(g.idJuego)}
                onToggleFavorite={() => handleToggleFavorite(g.idJuego)}
                onPlay={() => {
                  const matchingTrailer = trailers.find(
                    (t) => t.idJuego === g.idJuego,
                  ) || {
                    idTrailer: "temp",
                    idJuego: g.idJuego,
                    titulo: `Tráiler de ${g.titulo}`,
                    tipo: "Gameplay",
                    urlVideo:
                      "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_5MB.mp4",
                    urlPoster: g.imagenPortada,
                    duracionSegundos: 120,
                    vistas: 1000,
                  };
                  setSelectedTrailer(matchingTrailer);
                }}
              />
            ))}
          </div>
        </div>

        {/* Row 3: Launches */}
        <div className="flex flex-col">
          <h2 className="mb-4 text-xl font-bold tracking-wider uppercase text-slate-100">
            Próximas Novedades
          </h2>
          <div className="flex gap-4 p-4 overflow-x-auto">
            {launches.map((l) => (
              <LaunchRowMiniCard key={l.idLanzamiento} launch={l} />
            ))}
          </div>
        </div>
      </div>

      {/* Video Player overlay */}
      {selectedTrailer && (
        <VideoPlayer
          videoUrl={selectedTrailer.urlVideo}
          title={`${selectedTrailer.juego?.titulo || "Juego"} — ${selectedTrailer.titulo}`}
          onClose={() => {
            setSelectedTrailer(null);
            delayedFocus("BANNER_PLAY_BTN");
          }}
        />
      )}
    </div>
  );
}

interface HeroBannerProps {
  game: Game;
  trailer: Trailer | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPlayTrailer: (t: Trailer) => void;
}

function HeroBanner({
  game,
  trailer,
  isFavorite,
  onToggleFavorite,
  onPlayTrailer,
}: HeroBannerProps) {
  const { ref: playBtnRef, focused: playFocused } = useFocusable({
    focusKey: "BANNER_PLAY_BTN",
    onEnterPress: () => {
      if (trailer) {
        onPlayTrailer(trailer);
      }
    },
  });

  const { ref: listBtnRef, focused: listFocused } = useFocusable({
    focusKey: "BANNER_LIST_BTN",
    onEnterPress: () => onToggleFavorite(),
  });

  return (
    <div className="h-[75vh] min-h-[500px] w-full relative overflow-hidden bg-black select-none">
      {/* Background Video Player loop / muted */}
      {trailer?.urlVideo ? (
        <video
          src={trailer.urlVideo}
          className="absolute inset-0 object-cover w-full h-full opacity-60"
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <img
          src={game.bannerUrl}
          className="absolute inset-0 object-cover w-full h-full opacity-60"
          alt="Game Banner"
        />
      )}

      {/* Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c090c] via-[#0c090c]/20 to-transparent" />

      {/* Content */}
      <div className="absolute z-20 flex flex-col max-w-2xl gap-4 bottom-28 left-8">
        <div className="flex items-center gap-2">
          <span className="bg-purple-600 text-white text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded">
            DESTACADO
          </span>
          <span className="text-sm font-semibold text-slate-300">
            {game.desarrollador}
          </span>
        </div>

        <h1 className="text-6xl font-black leading-none tracking-tight text-white uppercase drop-shadow-md">
          {game.titulo}
        </h1>

        <p className="text-base font-medium leading-relaxed text-slate-300 drop-shadow-sm line-clamp-3">
          {game.descripcion}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-2">
          {trailer && (
            <button
              ref={playBtnRef}
              className={`px-8 py-3.5 rounded-xl font-extrabold text-base flex items-center gap-2 outline-none transition-all duration-200 ${
                playFocused
                  ? "bg-purple-500 text-white scale-105 shadow-[0_0_20px_rgba(168,85,247,0.6)]"
                  : "bg-white text-slate-900"
              }`}
            >
              <Play className="fill-current size-5" />
              <span>REPRODUCIR TRAILER</span>
            </button>
          )}

          <button
            ref={listBtnRef}
            className={`px-6 py-3.5 rounded-xl font-extrabold text-base flex items-center gap-2 outline-none transition-all duration-200 ${
              listFocused
                ? "bg-purple-500 text-white scale-105 shadow-[0_0_20px_rgba(168,85,247,0.6)]"
                : "bg-slate-800/80 text-slate-300 border border-slate-700 backdrop-blur-sm"
            }`}
          >
            {isFavorite ? (
              <Check className="text-green-400 size-5" />
            ) : (
              <Plus className="size-5" />
            )}
            <span>MI LISTA</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Row containers with FocusContext so off-screen cards stay reachable via arrow keys
function TrailersRow({ trailers, onPlay }: { trailers: Trailer[]; onPlay: (t: Trailer) => void }) {
  const { ref, focusKey } = useFocusable({ focusKey: "HOME_TRAILERS_ROW" });
  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {trailers.map((t) => (
          <TrailerCard key={t.idTrailer} trailer={t} onPlay={onPlay} />
        ))}
      </div>
    </FocusContext.Provider>
  );
}

function GamesRow({ games, favorites, onToggleFavorite, onPlay }: {
  games: Game[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onPlay: (g: Game) => void;
}) {
  const { ref, focusKey } = useFocusable({ focusKey: "HOME_GAMES_ROW" });
  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {games.map((g) => (
          <GameRowCard
            key={g.idJuego}
            game={g}
            isFavorite={favorites.includes(g.idJuego)}
            onToggleFavorite={() => onToggleFavorite(g.idJuego)}
            onPlay={() => onPlay(g)}
          />
        ))}
      </div>
    </FocusContext.Provider>
  );
}

function LaunchesRow({ launches }: { launches: UpcomingLaunch[] }) {
  const { ref, focusKey } = useFocusable({ focusKey: "HOME_LAUNCHES_ROW" });
  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {launches.map((l) => (
          <LaunchRowMiniCard key={l.idLanzamiento} launch={l} />
        ))}
      </div>
    </FocusContext.Provider>
  );
}

// Cards
function TrailerCard({
  trailer,
  onPlay,
}: {
  trailer: Trailer;
  onPlay: (t: Trailer) => void;
}) {
  const { ref, focused } = useFocusable({
    focusKey: `TRAILER_CARD_${trailer.idTrailer}`,
    onEnterPress: () => onPlay(trailer),
    onFocus: () => ref.current?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' }),
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
      className={`ring-4 min-w-[18rem] w-72 h-44 bg-slate-900 border rounded-xl overflow-hidden relative transition-all duration-300 transform outline-none ${
        focused
          ? "border-purple-500 ring-purple-500"
          : "border-slate-800 ring-transparent"
      }`}
    >
      <img
        src={trailer.urlPoster}
        className={`object-cover w-full h-full transition-all duration-300 ${focused ? "scale-110" : "scale-100"}`}
        alt={trailer.titulo}
      />

      {/* Shadow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* Focus indicators */}
      {focused && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="p-3 text-white bg-purple-600 rounded-full shadow-lg">
            <Play className="fill-current size-5" />
          </div>
        </div>
      )}

      {/* Info labels */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-0.5">
        <span className="text-[10px] font-black uppercase text-purple-400">
          {trailer.juego?.titulo || "Trailer"}
        </span>
        <h4 className="text-xs font-bold text-white truncate">
          {trailer.titulo}
        </h4>
      </div>

      {/* Duration badge */}
      <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-[10px] text-slate-300 font-bold px-1.5 py-0.5 rounded font-mono">
        {Math.floor(trailer.duracionSegundos / 60)}:
        {trailer.duracionSegundos % 60 < 10 ? "0" : ""}
        {trailer.duracionSegundos % 60}
      </span>
    </div>
  );
}

function GameRowCard({
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
    focusKey: `GAMEROW_CARD_${game.idJuego}`,
    onEnterPress: () => onPlay(),
    onFocus: () => ref.current?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' }),
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
      className={`ring-4 min-w-[10rem] w-40 h-60 bg-slate-900 border rounded-xl overflow-hidden relative transition-all duration-300 transform outline-none ${
        focused
          ? "border-purple-500 ring-purple-500"
          : "border-slate-800 ring-transparent"
      }`}
    >
      <img
        src={game.imagenPortada}
        className={`object-cover w-full h-full transition-all duration-300 ${focused ? "scale-110" : "scale-100"}`}
        alt={game.titulo}
      />

      {/* Hover action overlay */}
      {focused && (
        <div className="absolute inset-0 flex flex-col justify-between p-3 bg-black/75 animate-fade-in">
          <div className="flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className={`p-1.5 rounded-full ${isFavorite ? "bg-purple-600 text-white" : "bg-black/50 text-slate-400"}`}
            >
              <Star className="size-3.5 fill-current" />
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <h4 className="text-xs font-bold text-white line-clamp-2">
              {game.titulo}
            </h4>
            <span className="text-[10px] font-bold text-slate-400">
              {game.desarrollador}
            </span>
            <button className="bg-purple-500 text-white py-1 rounded text-[10px] font-bold mt-1 flex items-center justify-center gap-1">
              <Play className="size-2.5 fill-current" /> Ver Trailer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function LaunchRowMiniCard({ launch }: { launch: UpcomingLaunch }) {
  const { ref, focused } = useFocusable({
    focusKey: `LAUNCHROW_CARD_${launch.idLanzamiento}`,
    onFocus: () => ref.current?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' }),
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
      className={`ring-4 min-w-[16rem] w-64 h-36 bg-slate-900 border rounded-xl overflow-hidden relative transition-all duration-300 transform outline-none ${
        focused
          ? "border-purple-500 ring-purple-500"
          : "border-slate-800 ring-transparent"
      }`}
    >
      <img
        src={launch.bannerUrl}
        className={`object-cover w-full h-full transition-all duration-300 ${focused ? "scale-110" : "scale-100"}`}
        alt={launch.juego.titulo}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />

      <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-0.5">
        <h4 className="text-sm font-bold text-white truncate">
          {launch.juego.titulo}
        </h4>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[9px] font-extrabold text-amber-400 uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 rounded">
            {launch.ventanaLanzamiento}
          </span>
          {launch.reservado && (
            <span className="text-[9px] font-bold text-emerald-400 uppercase">
              Reservado ✅
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
