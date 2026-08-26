import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/tokens";

export async function GET(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { email } = await verifyAccessToken(token);
    return NextResponse.json({ email });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
