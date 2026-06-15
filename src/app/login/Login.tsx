import { useNavigate } from "react-router-dom";
import {
  setFocus,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { useEffect } from "react";

export function Login() {
  const navigate = useNavigate();

  const { ref, focused } = useFocusable({
    onEnterPress: () => {
      navigate("/home");
    },
    focusKey: "FIRST_CARD",
  });

  useEffect(() => {
    setFocus("FIRST_CARD");
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <p>Login page</p>
      <button
        ref={ref}
        className={`px-4 py-2 bg-purple-500 rounded-xl ring-2 ${focused ? "ring-red-500" : ""}`}
      >
        Ir a home
      </button>
    </div>
  );
}
