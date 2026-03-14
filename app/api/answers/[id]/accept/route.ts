import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// POST /api/answers/[id]/accept — mark answer as accepted (question author only)
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { id } = await params;

  const answer = await prisma.answer.findUnique({
    where: { id },
    include: { question: { select: { authorId: true, id: true } } },
  });

  if (!answer) {
    return NextResponse.json({ error: "Answer not found." }, { status: 404 });
  }

  // Only the question author can accept an answer
  if (answer.question.authorId !== session.user.id) {
    return NextResponse.json({ error: "Only the question author can accept an answer." }, { status: 403 });
  }

  // Un-accept all other answers for this question, then toggle this one
  await prisma.$transaction([
    prisma.answer.updateMany({
      where: { questionId: answer.question.id, isAccepted: true },
      data: { isAccepted: false },
    }),
    prisma.answer.update({
      where: { id },
      data: { isAccepted: !answer.isAccepted },
    }),
  ]);

  // Mark question as resolved if accepting, unresolved if un-accepting
  await prisma.question.update({
    where: { id: answer.question.id },
    data: { isResolved: !answer.isAccepted },
  });

  return NextResponse.json({ accepted: !answer.isAccepted });
}
