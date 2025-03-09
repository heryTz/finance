import { NextResponse } from "next/server";
import { z } from "zod";
import { NotFoundError } from "./exception";
import { logError } from "./logger";

type Handler<T extends unknown[]> = (
  ...args: T
) => Promise<NextResponse | Response>;

export const weh =
  <T extends unknown[]>(handler: Handler<T>) =>
  async (...args: T) => {
    try {
      return await handler(...args);
    } catch (error) {
      logError(error);
      if (error instanceof z.ZodError) {
        return new Response(JSON.stringify(error.issues), { status: 400 });
      }
      if (error instanceof NotFoundError) {
        return new Response(error.message, { status: 404 });
      }
      return new Response("Internal server error", { status: 500 });
    }
  };
