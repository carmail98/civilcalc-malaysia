import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/questions/[id] — get single question with answers
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const question = await prisma.question.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, image: true, bemNumber: true, role: true } },
      answers: {
        include: {
          author: { select: { id: true, name: true, image: true, bemNumber: true, role: true } },
          votes: { select: { value: true, userId: true } },
        },
        orderBy: [{ isAccepted: "desc" }, { createdAt: "asc" }],
      },
      votes: { select: { value: true, userId: true } },
    },
  });

  if (!question) {
    return NextResponse.json({ error: "Question not found." }, { status: 404 });
  }

  // Increment view count (fire-and-forget)
  prisma.question.update({ where: { id }, data: { viewCount: { increment: 1 } } }).catch(() => {});

  const questionVoteScore = question.votes.reduce((sum, v) => sum + v.value, 0);
  const answers = question.answers.map((a) => ({
    ...a,
    voteScore: a.votes.reduce((sum, v) => sum + v.value, 0),
  }));

  return NextResponse.json({ ...question, voteScore: questionVoteScore, answers });
}
