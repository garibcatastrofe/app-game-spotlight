import { useEffect, useState } from "react";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useDelayedFocus } from "../../shared/hooks/useDelayedFocus";
import { api, Notificacion } from "../../shared/services/api";
import { Bell, CheckCheck, Rocket, Clapperboard, AlertTriangle, Star, Gift } from "lucide-react";

const TIPO_ICON: Record<string, React.ElementType> = {
  lanzamiento: Rocket,
  trailer: Clapperboard,
  alerta: AlertTriangle,
  mi_lista: Star,
  recompensa: Gift,
};

export function NotificationsView() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);

  const delayedFocus = useDelayedFocus();

  const { ref: containerRef } = useFocusable({
    focusKey: "NOTIFICATIONS_CONTAINER",
  });

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await api.getNotifications();
        if (isMounted) {
          setNotificaciones(data);
          setLoading(false);
          delayedFocus(
            data.length > 0 ? `NOTIF_${data[0].idNotificacion}` : "SIDEBAR_/notifications"
          );
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const handleMarkAll = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkOne = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotificaciones((prev) =>
        prev.map((n) => (n.idNotificacion === id ? { ...n, leida: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notificaciones.filter((n) => !n.leida).length;

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-8 w-full">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">Notificaciones</h1>
          <p className="text-slate-400 text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} sin leer` : "Todo leído"}
          </p>
        </div>
        {unreadCount > 0 && <MarkAllButton onPress={handleMarkAll} />}
      </div>

      <div ref={containerRef} className="flex flex-col gap-4 pb-24">
        {notificaciones.map((n) => (
          <NotifRow key={n.idNotificacion} notif={n} onRead={() => handleMarkOne(n.idNotificacion)} />
        ))}
        {notificaciones.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Bell className="size-16 text-slate-700" />
            <p className="text-slate-500">No tienes notificaciones.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MarkAllButton({ onPress }: { onPress: () => void }) {
  const { ref, focused } = useFocusable({
    focusKey: "NOTIF_MARK_ALL",
    onEnterPress: onPress,
  });

  return (
    <button
      ref={ref}
      onClick={onPress}
      className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border transition-all duration-200 ${
        focused
          ? "bg-purple-600 border-purple-500 text-white"
          : "border-slate-700 text-slate-400 hover:text-white"
      }`}
    >
      <CheckCheck className="size-4" />
      Marcar todo como leído
    </button>
  );
}

function NotifRow({ notif, onRead }: { notif: Notificacion; onRead: () => void }) {
  const { ref, focused } = useFocusable({
    focusKey: `NOTIF_${notif.idNotificacion}`,
    onEnterPress: () => { if (!notif.leida) onRead(); },
  });

  const Icon = (notif.tipo && TIPO_ICON[notif.tipo]) || Bell;

  const fecha = new Date(notif.fechaCreacion).toLocaleDateString("es-ES", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={`flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 select-none ${
        focused
          ? "border-purple-500 bg-slate-900"
          : notif.leida
          ? "border-slate-800 bg-slate-900/50"
          : "border-slate-700 bg-slate-900"
      }`}
    >
      <div className={`p-2.5 rounded-full flex-shrink-0 ${notif.leida ? "bg-slate-800" : "bg-purple-600/30"}`}>
        <Icon className={`size-5 ${notif.leida ? "text-slate-500" : "text-purple-300"}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`font-bold text-sm ${notif.leida ? "text-slate-400" : "text-white"}`}>
            {notif.titulo}
          </p>
          {!notif.leida && (
            <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{notif.mensaje}</p>
        <p className="text-xs text-slate-600 mt-1">{fecha}</p>
      </div>

      {!notif.leida && focused && (
        <span className="text-xs text-purple-400 font-semibold flex-shrink-0 self-center">ENTER para leer</span>
      )}
    </div>
  );
}
