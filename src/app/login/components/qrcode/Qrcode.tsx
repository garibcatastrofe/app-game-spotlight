import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFocusable, setFocus } from "@noriginmedia/norigin-spatial-navigation";
import { api, setToken, setUser } from "../../../../shared/services/api";

export function QrCode() {
  const navigate = useNavigate();
  const [code, setCode] = useState<string>("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [status, setStatus] = useState<"loading" | "pendiente" | "aprobado" | "expirado">("loading");

  useEffect(() => {
    let isMounted = true;
    let pollInterval: ReturnType<typeof setInterval>;

    const startQrFlow = async () => {
      setStatus("loading");
      try {
        const qrData = await api.generateQrCode();
        if (!isMounted) return;
        setCode(qrData.codigo);
        setQrDataUrl(qrData.qrDataUrl || "");
        setStatus("pendiente");

        pollInterval = setInterval(async () => {
          if (!isMounted) return;
          try {
            const check = await api.checkQrStatus(qrData.codigo);
            if (!isMounted) return;
            if (check.estado === "aprobado") {
              clearInterval(pollInterval);
              if (check.token) setToken(check.token);
              if (check.usuario) setUser(check.usuario);
              setStatus("aprobado");
              setTimeout(() => { if (isMounted) navigate("/home"); }, 1500);
            } else if (check.estado === "expirado") {
              clearInterval(pollInterval);
              setStatus("expirado");
            }
          } catch {
            // transient poll error — keep polling
          }
        }, 2000);
      } catch {
        if (isMounted) setStatus("expirado");
      }
    };

    startQrFlow();
    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [navigate]);

  return (
    <div className="flex p-6 rounded-xl border-[3px] bg-slate-700/50 border-slate-600 mb-4 items-center">
      <div className="p-2 mr-8 bg-white rounded-xl w-52 h-52 min-w-[13rem] min-h-[13rem] flex items-center justify-center relative overflow-hidden">
        {status === "loading" ? (
          <div className="flex flex-col items-center justify-center text-slate-800 font-semibold text-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-2"></div>
            Generando código...
          </div>
        ) : status === "aprobado" ? (
          <div className="flex flex-col items-center justify-center text-green-600 font-bold text-center p-2">
            <span className="text-5xl mb-2">✅</span>
            ¡Aprobado!
          </div>
        ) : (
          <img src={qrDataUrl} className="w-full h-full object-contain" alt="QR Login" />
        )}
      </div>

      <div className="flex flex-col justify-center flex-1">
        <p className="text-2xl font-bold text-slate-300">ACCESO POR QR</p>
        {status === "loading" && (
          <p className="text-lg text-slate-400">Generando tu código de vinculación...</p>
        )}
        {status === "aprobado" && (
          <div>
            <p className="text-3xl font-extrabold text-green-400 animate-pulse">¡SESIÓN VINCULADA!</p>
            <p className="text-slate-300">Redirigiendo a tu pantalla de inicio...</p>
          </div>
        )}
        {status === "expirado" && (
          <div>
            <p className="text-xl font-bold text-red-400">CÓDIGO EXPIRADO</p>
            <QrRegenButton onRegen={() => window.location.reload()} />
          </div>
        )}
        {status === "pendiente" && (
          <div>
            <p className="text-lg text-slate-400 mb-1">Escanea con tu móvil o ingresa el código:</p>
            <p className="text-5xl font-black text-purple-400 tracking-wider font-mono mb-2 bg-slate-900/60 p-2 px-4 rounded-xl border border-slate-700/50 w-fit">
              {code}
            </p>
            <p className="text-sm text-slate-400 italic animate-pulse">
              Esperando aprobación desde la aplicación móvil...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Separate component: useFocusable only registers when this button mounts (status === "expirado").
function QrRegenButton({ onRegen }: { onRegen: () => void }) {
  const { ref, focused } = useFocusable({
    focusKey: "QR_REGEN_BTN",
    onEnterPress: onRegen,
  });
  useEffect(() => { setFocus("QR_REGEN_BTN"); }, []);
  return (
    <button
      ref={ref}
      onClick={onRegen}
      className={`mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 outline-none ${focused ? "ring-2 ring-purple-400" : ""}`}
    >
      Regenerar
    </button>
  );
}
