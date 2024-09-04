import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const [value, setValue] = useState(
    typeof window !== "undefined" ? matchMedia(query).matches : false,
  );

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener("change", onChange);
    setValue(result.matches);

    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return value;
}

export function useMq() {
  const isXS = useMediaQuery("(max-width: 639px)");
  const isSM = useMediaQuery("(min-width: 640px)");
  const isMD = useMediaQuery("(min-width: 768px)");
  const isLG = useMediaQuery("(min-width: 1024px)");
  const isXL = useMediaQuery("(min-width: 1280px)");
  const is2XL = useMediaQuery("(min-width: 1536px)");
  return { isXS, isSM, isMD, isLG, isXL, is2XL };
}
