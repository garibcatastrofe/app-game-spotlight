import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate } from "react-router-dom";

export function LinkRegister() {
  const navigate = useNavigate();

  const { ref, focused } = useFocusable({
    focusKey: "LINK_REGISTER",
    onEnterPress: () => navigate("/register"),
  });

  return (
    <div className="flex justify-center w-full h-fit">
      <p
        ref={ref}
        tabIndex={-1}
        className={`p-4 rounded-xl ring-4 outline-none transition-all duration-300 w-fit text-xl font-bold text-white ${focused ? "ring-purple-500" : "ring-transparent"}`}
      >
        ¿No tienes cuenta? <span className="text-purple-400 underline">Ir a Registrarse</span>
      </p>
    </div>
  );
}
