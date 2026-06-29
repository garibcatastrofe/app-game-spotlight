import { useEffect, useState } from "react";
import { useFocusable, setFocus } from "@noriginmedia/norigin-spatial-navigation";
import { api, UpcomingLaunch } from "../../shared/services/api";
import { Calendar, Bell, BookmarkCheck } from "lucide-react";

export function LaunchesView() {
  const [launches, setLaunches] = useState<UpcomingLaunch[]>([]);
  const [loading, setLoading] = useState(true);

  const { ref: containerRef } = useFocusable({
    focusKey: "LAUNCHES_CONTAINER",
  });

  useEffect(() => {
    let isMounted = true;
    const loadLaunches = async () => {
      try {
        const data = await api.getUpcomingLaunches();
        if (isMounted) {
          setLaunches(data);
          setLoading(false);
          if (data.length > 0) {
            setTimeout(() => {
              setFocus(`LAUNCH_RESERVE_BTN_${data[0].idLanzamiento}`);
            }, 100);
          }
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setLoading(false);
      }
    };
    loadLaunches();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleReserve = async (idLanzamiento: string) => {
    try {
      const launch = launches.find((l) => l.idLanzamiento === idLanzamiento);
      if (launch?.reservado) {
        await api.cancelReservation(idLanzamiento);
      } else {
        await api.reserveLaunch(idLanzamiento);
      }
      setLaunches((prev) =>
        prev.map((l) =>
          l.idLanzamiento === idLanzamiento ? { ...l, reservado: !l.reservado } : l
        )
      );
    } catch (err) {
      console.error("Error reserving launch:", err);
    }
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
        <h1 className="text-4xl font-black text-white tracking-tight uppercase">Próximos Lanzamientos</h1>
        <p className="text-slate-400 text-sm mt-1">Sé el primero en jugar. Reserva y recibe notificaciones instantáneas el día del lanzamiento.</p>
      </div>

      <div
        ref={containerRef}
        className="flex flex-col gap-6 pb-24"
      >
        {launches.map((launch) => (
          <LaunchRowCard
            key={launch.idLanzamiento}
            launch={launch}
            onReserve={() => handleReserve(launch.idLanzamiento)}
          />
        ))}
      </div>
    </div>
  );
}

interface LaunchRowCardProps {
  launch: UpcomingLaunch;
  onReserve: () => void;
}

function LaunchRowCard({ launch, onReserve }: LaunchRowCardProps) {
  const { ref: cardRef, focused: cardFocused } = useFocusable({
    focusKey: `LAUNCH_CARD_${launch.idLanzamiento}`,
  });

  const { ref: reserveBtnRef, focused: reserveBtnFocused } = useFocusable({
    focusKey: `LAUNCH_RESERVE_BTN_${launch.idLanzamiento}`,
    onEnterPress: () => onReserve(),
  });

  // Calculate days remaining (mock countdown)
  const getDaysRemaining = (dateStr: string) => {
    const launchDate = new Date(dateStr);
    const today = new Date();
    const diffTime = launchDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} días restantes` : "Ya disponible";
  };

  return (
    <div
      ref={cardRef}
      className={`bg-slate-900 border rounded-2xl overflow-hidden flex h-60 items-center transition-all duration-300 relative outline-none select-none ${
        cardFocused ? "border-slate-700 bg-slate-850/80" : "border-slate-800"
      }`}
    >
      {/* Game Banner */}
      <div className="w-1/3 h-full relative bg-slate-950 overflow-hidden">
        <img
          src={launch.bannerUrl || launch.juego.bannerUrl}
          alt={launch.juego.titulo}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/90" />
      </div>

      {/* Info Column */}
      <div className="flex-1 p-6 flex flex-col justify-between h-full">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span className="bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold px-2.5 py-1 rounded-full uppercase flex items-center gap-1.5">
              <Calendar className="size-3" />
              {launch.ventanaLanzamiento}
            </span>
            <span className="text-amber-400 font-bold text-xs uppercase bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
              {getDaysRemaining(launch.fechaLanzamiento)}
            </span>
          </div>

          <h2 className="text-3xl font-black text-white leading-none mt-2">{launch.juego.titulo}</h2>
          <p className="text-xs text-slate-400 font-semibold">{launch.juego.desarrollador} • {launch.juego.editor}</p>
          <p className="text-sm text-slate-300 mt-3 line-clamp-2 leading-relaxed">{launch.descripcion}</p>
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <button
              ref={reserveBtnRef}
              className={`px-6 py-3 rounded-xl font-bold text-base transition-all duration-200 outline-none flex items-center gap-2 ${
                launch.reservado
                  ? "bg-emerald-600 text-white border border-emerald-500"
                  : reserveBtnFocused
                  ? "bg-purple-500 text-white scale-105 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-750"
              }`}
            >
              {launch.reservado ? (
                <>
                  <BookmarkCheck className="size-5" />
                  <span>RESERVADO</span>
                </>
              ) : (
                <>
                  <Bell className="size-5" />
                  <span>RESERVAR AHORA</span>
                </>
              )}
            </button>
          </div>
          <div className="text-slate-400 text-sm font-semibold italic">
            Fecha estimada: {new Date(launch.fechaLanzamiento).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
      </div>
    </div>
  );
}
