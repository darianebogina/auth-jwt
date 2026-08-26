import "server-only";
import { SignJWT, jwtVerify } from "jose";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = "30d";
export const REFRESH_TOKEN_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

export type TokenPayload = { email: string };

function secretFor(name: "ACCESS_TOKEN_SECRET" | "REFRESH_TOKEN_SECRET") {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return new TextEncoder().encode(value);
}

export function signAccessToken(email: string) {
  return new SignJWT({ email } satisfies TokenPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .sign(secretFor("ACCESS_TOKEN_SECRET"));
}

export async function verifyAccessToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, secretFor("ACCESS_TOKEN_SECRET"));
  return { email: payload.email as string };
}

export function signRefreshToken(email: string) {
  return new SignJWT({ email } satisfies TokenPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_TTL)
    .sign(secretFor("REFRESH_TOKEN_SECRET"));
}

export async function verifyRefreshToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, secretFor("REFRESH_TOKEN_SECRET"));
  return { email: payload.email as string };
}
