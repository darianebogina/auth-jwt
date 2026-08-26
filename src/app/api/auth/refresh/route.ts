import { NextResponse } from "next/server";
import {
  clearRefreshCookie,
  getRefreshCookie,
  setRefreshCookie,
} from "@/lib/auth/cookies";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/lib/auth/tokens";

export async function POST() {
  const token = await getRefreshCookie();

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { email } = await verifyRefreshToken(token);

    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken(email),
      signRefreshToken(email),
    ]);

    await setRefreshCookie(refreshToken);

    return NextResponse.json({ accessToken, email });
  } catch {
    await clearRefreshCookie();
    return NextResponse.json({ error: "Session expired" }, { status: 401 });
  }
}
