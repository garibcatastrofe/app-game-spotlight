import { useEffect, useState } from "react";
import { useFocusable, setFocus } from "@noriginmedia/norigin-spatial-navigation";
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

  // Focus parent container
  const { ref: containerRef } = useFocusable({
    focusKey: "HOME_CONTAINER",
  });

  useEffect(() => {
    let isMounted = true;
    const loadHomeData = async () => {
      try {
        const [gamesData, trailersData, launchesData, favsData] = await Promise.all([
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
          const featured = gamesData.find((g) => g.destacado) || gamesData[0] || null;
          setFeaturedGame(featured);

          if (featured) {
            const trailer = trailersData.find((t) => t.idJuego === featured.idJuego) || trailersData[0] || null;
            setFeaturedTrailer(trailer);
          }

          setLoading(false);
          // Set initial focus to the featured play button on banner
          setTimeout(() => {
            setFocus("BANNER_PLAY_BTN");
          }, 100);
        }
      } catch (err) {
        console.error("Error loading home page data:", err);
        if (isMounted) setLoading(false);
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
      <div className="flex h-full w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const isFeaturedFavorite = featuredGame ? favorites.includes(featuredGame.idJuego) : false;

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full overflow-y-auto w-full select-none"
    >
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
      <div className="flex flex-col gap-8 px-8 py-6 pb-32 bg-gradient-to-t from-[#0c090c] to-transparent -mt-20 relative z-10">
        
        {/* Row 1: Trailers */}
        <div className="flex flex-col">
          <h2 className="text-xl font-bold mb-4 tracking-wider uppercase text-slate-100">Trailers Recientes</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {trailers.map((t) => (
              <TrailerCard key={t.idTrailer} trailer={t} onPlay={(tr) => setSelectedTrailer(tr)} />
            ))}
          </div>
        </div>

        {/* Row 2: Games */}
        <div className="flex flex-col">
          <h2 className="text-xl font-bold mb-4 tracking-wider uppercase text-slate-100">Catálogo Destacado</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {games.map((g) => (
              <GameRowCard
                key={g.idJuego}
                game={g}
                isFavorite={favorites.includes(g.idJuego)}
                onToggleFavorite={() => handleToggleFavorite(g.idJuego)}
                onPlay={() => {
                  const matchingTrailer = trailers.find((t) => t.idJuego === g.idJuego) || {
                    idTrailer: "temp",
                    idJuego: g.idJuego,
                    titulo: `Tráiler de ${g.titulo}`,
                    tipo: "Gameplay",
                    urlVideo: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_5MB.mp4",
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
          <h2 className="text-xl font-bold mb-4 tracking-wider uppercase text-slate-100">Próximas Novedades</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
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
            setTimeout(() => {
              setFocus("BANNER_PLAY_BTN");
            }, 100);
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

function HeroBanner({ game, trailer, isFavorite, onToggleFavorite, onPlayTrailer }: HeroBannerProps) {
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
      {trailer ? (
        <video
          src={trailer.urlVideo}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <img
          src={game.bannerUrl}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          alt="Game Banner"
        />
      )}

      {/* Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c090c] via-[#0c090c]/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-28 left-8 max-w-2xl z-20 flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <span className="bg-purple-600 text-white text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded">
            DESTACADO
          </span>
          <span className="text-slate-300 text-sm font-semibold">{game.desarrollador}</span>
        </div>

        <h1 className="text-6xl font-black text-white leading-none uppercase tracking-tight drop-shadow-md">
          {game.titulo}
        </h1>

        <p className="text-slate-300 text-base leading-relaxed drop-shadow-sm font-medium line-clamp-3">
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
              <Play className="size-5 fill-current" />
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
            {isFavorite ? <Check className="size-5 text-green-400" /> : <Plus className="size-5" />}
            <span>MI LISTA</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Cards
function TrailerCard({ trailer, onPlay }: { trailer: Trailer; onPlay: (t: Trailer) => void }) {
  const { ref, focused } = useFocusable({
    focusKey: `TRAILER_CARD_${trailer.idTrailer}`,
    onEnterPress: () => onPlay(trailer),
  });

  return (
    <div
      ref={ref}
      className={`min-w-[18rem] w-72 h-44 bg-slate-900 border rounded-xl overflow-hidden relative transition-all duration-300 transform outline-none ${
        focused ? "border-purple-500 ring-4 ring-purple-500/30 scale-105" : "border-slate-800"
      }`}
    >
      <img src={trailer.urlPoster} className="w-full h-full object-cover opacity-80" alt={trailer.titulo} />
      
      {/* Shadow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* Focus indicators */}
      {focused && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-purple-600 p-3 rounded-full text-white shadow-lg">
            <Play className="size-5 fill-current" />
          </div>
        </div>
      )}

      {/* Info labels */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-0.5">
        <span className="text-[10px] font-black uppercase text-purple-400">
          {trailer.juego?.titulo || "Trailer"}
        </span>
        <h4 className="text-white text-xs font-bold truncate">{trailer.titulo}</h4>
      </div>

      {/* Duration badge */}
      <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-[10px] text-slate-300 font-bold px-1.5 py-0.5 rounded font-mono">
        {Math.floor(trailer.duracionSegundos / 60)}:{(trailer.duracionSegundos % 60) < 10 ? "0" : ""}{trailer.duracionSegundos % 60}
      </span>
    </div>
  );
}

function GameRowCard({ game, isFavorite, onToggleFavorite, onPlay }: { game: Game; isFavorite: boolean; onToggleFavorite: () => void; onPlay: () => void }) {
  const { ref, focused } = useFocusable({
    focusKey: `GAMEROW_CARD_${game.idJuego}`,
    onEnterPress: () => onPlay(),
  });

  return (
    <div
      ref={ref}
      className={`min-w-[10rem] w-40 h-60 bg-slate-900 border rounded-xl overflow-hidden relative transition-all duration-300 transform outline-none ${
        focused ? "border-purple-500 ring-4 ring-purple-500/30 scale-105" : "border-slate-800"
      }`}
    >
      <img src={game.imagenPortada} className="w-full h-full object-cover" alt={game.titulo} />
      
      {/* Hover action overlay */}
      {focused && (
        <div className="absolute inset-0 bg-black/75 flex flex-col justify-between p-3 animate-fade-in">
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
            <h4 className="text-white text-xs font-bold line-clamp-2">{game.titulo}</h4>
            <span className="text-[10px] font-bold text-slate-400">{game.desarrollador}</span>
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
  });

  return (
    <div
      ref={ref}
      className={`min-w-[16rem] w-64 h-36 bg-slate-900 border rounded-xl overflow-hidden relative transition-all duration-300 transform outline-none ${
        focused ? "border-purple-500 ring-4 ring-purple-500/30 scale-105" : "border-slate-800"
      }`}
    >
      <img src={launch.bannerUrl} className="w-full h-full object-cover opacity-60" alt={launch.juego.titulo} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />
      
      <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-0.5">
        <h4 className="text-white text-sm font-bold truncate">{launch.juego.titulo}</h4>
        <div className="flex justify-between items-center mt-1">
          <span className="text-[9px] font-extrabold text-amber-400 uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 rounded">
            {launch.ventanaLanzamiento}
          </span>
          {launch.reservado && (
            <span className="text-[9px] font-bold text-emerald-400 uppercase">Reservado ✅</span>
          )}
        </div>
      </div>
    </div>
  );
}
