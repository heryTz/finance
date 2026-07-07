"use server";
import { createServerFn } from "@tanstack/react-start";

const APP_VERSION_FALLBACK = "dev";

export const getAppMetaFn = createServerFn({ method: "GET" }).handler(() => ({
  version: process.env.APP_VERSION ?? APP_VERSION_FALLBACK,
  releaseDate: process.env.APP_RELEASE_DATE ?? null,
}));
