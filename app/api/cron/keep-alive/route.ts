import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  // Verify the request is from Vercel Cron (not public)
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Lightweight query to keep Supabase free tier alive
    const count = await prisma.user.count();
    return NextResponse.json({
      ok: true,
      users: count,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[KEEP-ALIVE ERROR]", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
