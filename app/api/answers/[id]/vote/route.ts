import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// POST /api/answers/[id]/vote — upvote or downvote an answer
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to vote." }, { status: 401 });
  }

  const { id } = await params;
  const { value } = await req.json();

  if (value !== 1 && value !== -1) {
    return NextResponse.json({ error: "Vote value must be 1 or -1." }, { status: 400 });
  }

  const answer = await prisma.answer.findUnique({ where: { id } });
  if (!answer) {
    return NextResponse.json({ error: "Answer not found." }, { status: 404 });
  }

  if (answer.authorId === session.user.id) {
    return NextResponse.json({ error: "You cannot vote on your own answer." }, { status: 403 });
  }

  const existing = await prisma.vote.findUnique({
    where: { userId_answerId: { userId: session.user.id, answerId: id } },
  });

  if (existing) {
    if (existing.value === value) {
      await prisma.vote.delete({ where: { id: existing.id } });
      return NextResponse.json({ voted: null });
    }
    await prisma.vote.update({ where: { id: existing.id }, data: { value } });
    return NextResponse.json({ voted: value });
  }

  await prisma.vote.create({
    data: { value, userId: session.user.id, answerId: id },
  });

  return NextResponse.json({ voted: value });
}
