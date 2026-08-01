import { useEffect, useState } from "react";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useDelayedFocus } from "../../shared/hooks/useDelayedFocus";
import { api, Noticia } from "../../shared/services/api";
import { Star, User, Calendar } from "lucide-react";

export function NoticiasView() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  const delayedFocus = useDelayedFocus();

  const { ref: containerRef } = useFocusable({
    focusKey: "NOTICIAS_CONTAINER",
  });

  useEffect(() => {
    let isMounted = true;
    const loadNoticias = async () => {
      try {
        const data = await api.getNoticias();
        if (isMounted) {
          setNoticias(data);
          setLoading(false);
          delayedFocus(data.length > 0 ? `NOTICIA_CARD_${data[0].idNoticia}` : "SIDEBAR_/noticias");
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setLoading(false);
      }
    };
    loadNoticias();
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
    <div className="flex flex-col gap-6 p-8 w-full">
      <div>
        <h1 className="text-4xl font-black text-white tracking-tight uppercase">Noticias</h1>
        <p className="text-slate-400 text-sm mt-1">Últimas noticias y novedades del mundo de los videojuegos.</p>
      </div>

      <div ref={containerRef} className="flex flex-col gap-6 pb-24">
        {noticias.map((noticia) => (
          <NoticiaCard key={noticia.idNoticia} noticia={noticia} />
        ))}
        {noticias.length === 0 && (
          <p className="text-slate-500 text-center py-16">No hay noticias disponibles.</p>
        )}
      </div>
    </div>
  );
}

interface NoticiaCardProps {
  noticia: Noticia;
}

function NoticiaCard({ noticia }: NoticiaCardProps) {
  const { ref: cardRef, focused } = useFocusable({
    focusKey: `NOTICIA_CARD_${noticia.idNoticia}`,
  });

  const fechaFormateada = noticia.fechaPublicacion
    ? new Date(noticia.fechaPublicacion).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div
      ref={cardRef}
      tabIndex={-1}
      className={`bg-slate-900 border rounded-2xl overflow-hidden flex h-52 items-center transition-all duration-300 outline-none select-none ${
        focused ? "border-slate-700" : "border-slate-800"
      }`}
    >
      {/* Portada */}
      <div className="w-64 min-w-64 h-full relative bg-slate-950 overflow-hidden">
        {noticia.imagenPortada ? (
          <img
            src={noticia.imagenPortada}
            alt={noticia.titulo}
            className="w-full h-full object-cover transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-800">
            <span className="text-slate-600 text-xs font-semibold uppercase">Sin imagen</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/80" />
      </div>

      {/* Contenido */}
      <div className="flex-1 p-6 flex flex-col justify-between h-full">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {noticia.destacada && (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-2.5 py-1 rounded-full uppercase flex items-center gap-1.5">
                <Star className="size-3" />
                Destacada
              </span>
            )}
            {fechaFormateada && (
              <span className="text-slate-400 text-xs flex items-center gap-1.5">
                <Calendar className="size-3" />
                {fechaFormateada}
              </span>
            )}
          </div>

          <h2 className="text-2xl font-black text-white leading-tight line-clamp-2">{noticia.titulo}</h2>

          {noticia.resumen && (
            <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">{noticia.resumen}</p>
          )}
        </div>

        {noticia.autor && (
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <User className="size-3" />
            <span>{noticia.autor.nombre}</span>
          </div>
        )}
      </div>
    </div>
  );
}
