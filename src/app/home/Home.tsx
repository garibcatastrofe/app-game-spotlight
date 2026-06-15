import { useNavigate } from "react-router-dom";
import {
  setFocus,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { useEffect } from "react";

export function Home() {
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
    <div className="flex flex-col gap-6 p-6">
      <p
        ref={ref}
        className={`font-bold text-5xl ring-2 transition-all duration-300 ${focused ? "ring-purple-500" : "ring-transparent"}`}
      >
        Hola, Pirita
      </p>
      <ReturnCard />
      {Array.from({ length: 20 }).map((_, i) => (
        <HomeCard index={i} />
      ))}
    </div>
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
      className={`font-semibold text-lg text-blue-300 underline ring-2 transition-all duration-300 ${focused ? "ring-purple-500" : "ring-transparent"}`}
    >
      Regresar al login
    </button>
  );
}

function HomeCard({ index }: { index: number }) {
  const { ref, focused } = useFocusable();

  useEffect(() => {
    if (focused && ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [focused, ref]);

  return (
    <div
      ref={ref}
      className={`bg-mauve-700 rounded-2xl p-4 flex flex-col gap-2 ring-2 transition-all duration-300 ${focused ? "ring-purple-500" : "ring-transparent"}`}
    >
      <p className="text-lg font-bold">Card</p>
      <p className="text-sm text-mauve-400">Número {index + 1}</p>
    </div>
  );
}
