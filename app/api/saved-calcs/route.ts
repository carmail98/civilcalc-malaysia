import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET — list saved calculations for a calculator
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const calcId = req.nextUrl.searchParams.get("calcId");
  if (!calcId) {
    return NextResponse.json({ error: "calcId required" }, { status: 400 });
  }

  const saved = await prisma.savedCalc.findMany({
    where: { userId: session.user.id, calcId },
    orderBy: { savedAt: "desc" },
    select: { id: true, name: true, values: true, savedAt: true },
  });

  return NextResponse.json(saved);
}

// POST — save a calculation
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { calcId, name, values } = body;

  if (!calcId || !name || !values) {
    return NextResponse.json({ error: "calcId, name, and values required" }, { status: 400 });
  }

  // Upsert: update if same user+calcId+name, otherwise create
  const saved = await prisma.savedCalc.upsert({
    where: {
      userId_calcId_name: { userId: session.user.id, calcId, name },
    },
    update: { values, savedAt: new Date() },
    create: {
      userId: session.user.id,
      calcId,
      name,
      values,
    },
  });

  return NextResponse.json({ id: saved.id }, { status: 201 });
}

// DELETE — remove a saved calculation
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id");
  const calcId = req.nextUrl.searchParams.get("calcId");
  const all = req.nextUrl.searchParams.get("all");

  if (all === "true" && calcId) {
    // Clear all for this calculator
    await prisma.savedCalc.deleteMany({
      where: { userId: session.user.id, calcId },
    });
    return NextResponse.json({ ok: true });
  }

  if (!id) {
    return NextResponse.json({ error: "id or all+calcId required" }, { status: 400 });
  }

  await prisma.savedCalc.deleteMany({
    where: { id, userId: session.user.id },
  });

  return NextResponse.json({ ok: true });
}
