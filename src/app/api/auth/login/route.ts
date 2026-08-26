import { NextResponse } from "next/server";
import { verifyCredentials } from "@/lib/auth/credentials";
import { signAccessToken, signRefreshToken } from "@/lib/auth/tokens";
import { setRefreshCookie } from "@/lib/auth/cookies";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password || !verifyCredentials(email, password)) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken(email),
    signRefreshToken(email),
  ]);

  await setRefreshCookie(refreshToken);

  return NextResponse.json({ accessToken, email });
}
