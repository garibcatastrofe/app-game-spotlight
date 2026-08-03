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
      <div className="flex items-center justify-center w-full h-full">
        <div className="w-12 h-12 border-b-2 border-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-6 p-8">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-white uppercase">Noticias</h1>
        <p className="mt-1 text-sm text-slate-400">Últimas noticias y novedades del mundo de los videojuegos.</p>
      </div>

      <div ref={containerRef} className="flex flex-col gap-6 pb-24">
        {noticias.map((noticia) => (
          <NoticiaCard key={noticia.idNoticia} noticia={noticia} />
        ))}
        {noticias.length === 0 && (
          <p className="py-16 text-center text-slate-500">No hay noticias disponibles.</p>
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
      className={`bg-slate-900 ring-4 rounded-2xl overflow-hidden flex h-52 items-center transition-all duration-300 outline-none select-none ${
        focused ? "ring-purple-500" : "ring-transparent"
      }`}
    >
      {/* Portada */}
      <div className="relative w-64 h-full overflow-hidden min-w-64 bg-slate-950">
        {noticia.imagenPortada ? (
          <img
            src={noticia.imagenPortada}
            alt={noticia.titulo}
            className="object-cover w-full h-full transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-slate-800">
            <span className="text-xs font-semibold uppercase text-slate-600">Sin imagen</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/80" />
      </div>

      {/* Contenido */}
      <div className="flex flex-col justify-between flex-1 h-full p-6">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
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

          <h2 className="text-2xl font-black leading-tight text-white line-clamp-2">{noticia.titulo}</h2>

          {noticia.resumen && (
            <p className="text-sm leading-relaxed text-slate-300 line-clamp-2">{noticia.resumen}</p>
          )}
        </div>

        {noticia.autor && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <User className="size-3" />
            <span>{noticia.autor.nombre}</span>
          </div>
        )}
      </div>
    </div>
  );
}
