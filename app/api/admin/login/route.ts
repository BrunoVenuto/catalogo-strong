import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const password = body?.password;

  const expected = process.env.ADMIN_PASSWORD || "admin123";

  if (typeof password !== "string" || password !== expected) {
    return NextResponse.json({ ok: false, error: "Senha inválida" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: "admin_auth",
    value: "1",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}
