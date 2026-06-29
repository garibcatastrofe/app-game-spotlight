import { PlaystationIcon } from "../../icons/playstation/PlaystationIcon";

export function PlaystationButton() {
  return (
    <div className="relative p-4 rounded-xl font-semibold text-2xl flex gap-4 items-center justify-center border-[3px] bg-slate-700/30 border-slate-600 opacity-50 cursor-not-allowed select-none">
      <div className="w-10 h-10 mr-4 min-w-10 min-h-10">
        <PlaystationIcon />
      </div>
      <p>INICIAR SESIÓN CON PLAYSTATION</p>
      <span className="absolute -top-2 -right-2 bg-slate-900 text-[10px] font-black text-purple-300 border border-purple-500/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
        Próximamente
      </span>
    </div>
  );
}