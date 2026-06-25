import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../../shared/services/api";

export function QrCode() {
  const navigate = useNavigate();
  const [code, setCode] = useState<string>("");
  const [qrUrl, setQrUrl] = useState<string>("");
  const [status, setStatus] = useState<string>("pendiente");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    let pollInterval: any;

    const startQrFlow = async () => {
      try {
        setLoading(true);
        const qrData = await api.generateQrCode();
        if (isMounted) {
          setCode(qrData.codigo);
          // Generate a real QR code using public free API
          const mobileLink = `http://localhost:3000/approve-login?code=${qrData.codigo}`;
          setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=0c090c&data=${encodeURIComponent(mobileLink)}`);
          setLoading(false);
          setStatus("pendiente");

          // Start polling
          pollInterval = setInterval(async () => {
            try {
              const check = await api.checkQrStatus(qrData.codigo);
              if (isMounted) {
                if (check.estado === "aprobado") {
                  setStatus("aprobado");
                  clearInterval(pollInterval);
                  // Simulate brief success delay before redirecting
                  setTimeout(() => {
                    if (isMounted) navigate("/home");
                  }, 1500);
                } else if (check.estado === "expirado") {
                  setStatus("expirado");
                  clearInterval(pollInterval);
                }
              }
            } catch (err) {
              console.error("Error checking QR status:", err);
            }
          }, 2000);
        }
      } catch (error) {
        console.error("Error generating QR code:", error);
        if (isMounted) setLoading(false);
      }
    };

    startQrFlow();

    return () => {
      isMounted = false;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [navigate]);

  return (
    <div className="flex p-6 rounded-xl border-[3px] bg-slate-700/50 border-slate-600 mb-4 items-center">
      <div className="p-2 mr-8 bg-white rounded-xl w-52 h-52 min-w-[13rem] min-h-[13rem] flex items-center justify-center relative overflow-hidden">
        {loading ? (
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
          <img src={qrUrl} className="w-full h-full object-contain" alt="QR Login" />
        )}
      </div>

      <div className="flex flex-col justify-center flex-1">
        <p className="text-2xl font-bold text-slate-300">ACCESO POR QR</p>
        
        {loading ? (
          <p className="text-lg text-slate-400">Generando tu código de vinculación...</p>
        ) : status === "aprobado" ? (
          <div>
            <p className="text-3xl font-extrabold text-green-400 animate-pulse">¡SESIÓN VINCULADA!</p>
            <p className="text-slate-300">Redirigiendo a tu pantalla de inicio...</p>
          </div>
        ) : status === "expirado" ? (
          <div>
            <p className="text-xl font-bold text-red-400">CÓDIGO EXPIRADO</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700"
            >
              Regenerar
            </button>
          </div>
        ) : (
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
