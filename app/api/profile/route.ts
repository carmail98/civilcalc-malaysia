import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bemNumber: true,
      role: true,
      organisation: true,
      state: true,
      specialisation: true,
      yearsExp: true,
      bio: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await req.json();
  const allowedFields = [
    "name", "bemNumber", "organisation", "state",
    "specialisation", "yearsExp", "bio",
  ] as const;

  const data: Record<string, string | number | null> = {};
  for (const field of allowedFields) {
    if (field in body) {
      data[field] = body[field] === "" ? null : body[field];
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update." },
      { status: 400 }
    );
  }

  // Check BEM uniqueness if updating
  if (data.bemNumber) {
    const existingBem = await prisma.user.findUnique({
      where: { bemNumber: data.bemNumber as string },
    });
    if (existingBem && existingBem.id !== session.user.id) {
      return NextResponse.json(
        { error: "This BEM number is already registered by another user." },
        { status: 409 }
      );
    }
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      bemNumber: true,
      role: true,
      organisation: true,
      state: true,
      specialisation: true,
      yearsExp: true,
      bio: true,
    },
  });

  return NextResponse.json(updated);
}
