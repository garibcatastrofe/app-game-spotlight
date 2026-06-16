import qrcode from "../../images/codigo.png";

export function QrCode() {
  return (
    <div className="flex p-6 rounded-xl border-[3px] bg-slate-700/50 border-slate-600 mb-4">
      <div className="p-2 mr-8 bg-white rounded-xl w-52 h-52 min-w-52 min-h-52">
        <img src={qrcode} className="w-full h-full" />
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-4xl font-semibold">INICIAR SESIÓN</p>
        <p className="text-4xl font-semibold">CON CÓDIGO QR</p>
        <p className="text-xl">Escanea con tu móvil</p>
      </div>
    </div>
  );
}
