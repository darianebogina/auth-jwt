import "server-only";
import { timingSafeEqual } from "node:crypto";

function safeCompare(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyCredentials(email: string, password: string) {
  const validEmail = process.env.AUTH_EMAIL;
  const validPassword = process.env.AUTH_PASSWORD;
  if (!validEmail || !validPassword) {
    throw new Error("AUTH_EMAIL/AUTH_PASSWORD are not configured");
  }
  return safeCompare(email, validEmail) && safeCompare(password, validPassword);
}
