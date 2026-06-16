import { useNavigate } from "react-router-dom";
import {
  setFocus,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { useEffect } from "react";

export function Genres() {
  const { ref, focused } = useFocusable({
    focusKey: "FIRST_CARD",
  });

  useEffect(() => {
    setFocus("FIRST_CARD");
  }, []);

  useEffect(() => {
    if (focused && ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [focused, ref]);

  return (
    <div className="flex flex-col h-full gap-6 p-6 overflow-y-auto">
      <div
        ref={ref}
        className={`rounded-2xl ring-4 transition-all duration-300 ${focused ? "ring-purple-500" : "ring-transparent"}`}
      >
        <HeroImage />
      </div>

      <ReturnCard />
    </div>
  );
}

function HeroImage() {
  const { ref, focused } = useFocusable({
    onEnterPress: () => {},
  });

  return (
    <div
      ref={ref}
      className={`w-full rounded-2xl bg-slate-900 h-64 ring-4 transition-all duration-300 min-h-64 ${focused ? "ring-purple-500" : "ring-transparent"}`}
    ></div>
  );
}

function ReturnCard() {
  const navigate = useNavigate();

  const { ref, focused } = useFocusable({
    onEnterPress: () => {
      navigate("/");
    },
  });

  useEffect(() => {
    if (focused && ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [focused, ref]);

  return (
    <button
      ref={ref}
      className={`font-semibold text-lg text-blue-300 underline ring-4 transition-all duration-300 w-fit p-2 rounded-xl ${focused ? "ring-purple-500" : "ring-transparent"}`}
    >
      Regresar al login
    </button>
  );
}