import { useEffect, useRef } from "react";
import { setFocus } from "@noriginmedia/norigin-spatial-navigation";

export function useDelayedFocus() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (key: string, delay = 100) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setFocus(key);
    }, delay);
  };
}
