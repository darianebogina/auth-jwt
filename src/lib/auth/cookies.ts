import "server-only";
import { cookies } from "next/headers";
import { REFRESH_TOKEN_MAX_AGE_SECONDS } from "./tokens";

const REFRESH_COOKIE_NAME = "refresh_token";
const REFRESH_COOKIE_PATH = "/api/auth";

export async function setRefreshCookie(token: string) {
  const store = await cookies();
  store.set(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: REFRESH_COOKIE_PATH,
    maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
  });
}

export async function clearRefreshCookie() {
  const store = await cookies();
  store.delete({ name: REFRESH_COOKIE_NAME, path: REFRESH_COOKIE_PATH });
}

export async function getRefreshCookie() {
  const store = await cookies();
  return store.get(REFRESH_COOKIE_NAME)?.value;
}
