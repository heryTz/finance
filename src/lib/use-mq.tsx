import { useMediaQuery } from "@uidotdev/usehooks";

export function useMq() {
  const isXS = useMediaQuery("(max-width: 639px)");
  const isSM = useMediaQuery("(min-width: 640px)");
  const isMD = useMediaQuery("(min-width: 768px)");
  const isLG = useMediaQuery("(min-width: 1024px)");
  const isXL = useMediaQuery("(min-width: 1280px)");
  const is2XL = useMediaQuery("(min-width: 1536px)");
  return { isXS, isSM, isMD, isLG, isXL, is2XL };
}
