import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// POST /api/questions/[id]/answers — post an answer
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to answer." }, { status: 401 });
  }

  const { id } = await params;
  const { body } = await req.json();

  if (!body || typeof body !== "string" || body.trim().length < 10) {
    return NextResponse.json({ error: "Answer must be at least 10 characters." }, { status: 400 });
  }

  const question = await prisma.question.findUnique({ where: { id } });
  if (!question) {
    return NextResponse.json({ error: "Question not found." }, { status: 404 });
  }

  const answer = await prisma.answer.create({
    data: {
      body: body.trim(),
      questionId: id,
      authorId: session.user.id,
    },
    include: {
      author: { select: { id: true, name: true, image: true, bemNumber: true, role: true } },
    },
  });

  return NextResponse.json(answer, { status: 201 });
}
