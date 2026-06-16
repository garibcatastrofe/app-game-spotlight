import { GoogleIcon } from "../../icons/google/GoogleIcon";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";

export function GoogleButton() {
  const { ref, focused } = useFocusable();

  return (
    <button
      ref={ref}
      className={`p-4 mb-4 rounded-xl font-semibold text-2xl flex items-center justify-center border-[3px] bg-slate-700/50 border-slate-600 ring-4 transition-all duration-300 ${focused ? "ring-purple-500" : "ring-transparent"}`}
    >
      <div className="w-10 h-10 mr-4 min-w-10 min-h-10">
        <GoogleIcon />
      </div>
      <p>INICIAR SESIÓN CON GOOGLE</p>
    </button>
  );
}
