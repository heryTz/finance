"use client";

import { useEffect } from "react";
import { genTitle } from "./seo";

export function useSeo(params: { title: string }) {
  useEffect(() => {
    document.title = genTitle(params.title);
  }, [params.title]);
}
