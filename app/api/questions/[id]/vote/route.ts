import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// POST /api/questions/[id]/vote — upvote or downvote a question
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

  const question = await prisma.question.findUnique({ where: { id } });
  if (!question) {
    return NextResponse.json({ error: "Question not found." }, { status: 404 });
  }

  // Prevent self-voting
  if (question.authorId === session.user.id) {
    return NextResponse.json({ error: "You cannot vote on your own question." }, { status: 403 });
  }

  const existing = await prisma.vote.findUnique({
    where: { userId_questionId: { userId: session.user.id, questionId: id } },
  });

  if (existing) {
    if (existing.value === value) {
      // Same vote — remove it (toggle off)
      await prisma.vote.delete({ where: { id: existing.id } });
      return NextResponse.json({ voted: null });
    }
    // Different vote — update
    await prisma.vote.update({ where: { id: existing.id }, data: { value } });
    return NextResponse.json({ voted: value });
  }

  await prisma.vote.create({
    data: { value, userId: session.user.id, questionId: id },
  });

  return NextResponse.json({ voted: value });
}
