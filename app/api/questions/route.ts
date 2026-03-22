import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/questions — list questions with filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tag = searchParams.get("tag");
    const sort = searchParams.get("sort") || "newest";
    const postType = searchParams.get("postType"); // QUESTION, FACT, TERM
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = 20;

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (postType && ["QUESTION", "FACT", "TERM"].includes(postType)) {
      where.postType = postType;
    }
    if (tag) {
      where.tags = { has: tag };
    }
    if (sort === "unanswered") {
      where.answers = { none: {} };
    }

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: { select: { id: true, name: true, image: true, bemNumber: true, role: true } },
          _count: { select: { answers: true, votes: true } },
          votes: { select: { value: true } },
        },
      }),
      prisma.question.count({ where }),
    ]);

    const data = questions.map((q) => {
      const voteScore = q.votes.reduce((sum, v) => sum + v.value, 0);
      const { votes: _votes, ...rest } = q;
      return { ...rest, voteScore };
    });

    // Sort by votes client-side if requested (simpler than Prisma relation orderBy)
    if (sort === "votes") {
      data.sort((a, b) => b.voteScore - a.voteScore);
    }

    return NextResponse.json({ questions: data, total, page, pages: Math.ceil(total / limit) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : "";
    console.error("GET /api/questions error:", message, stack);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/questions — create a new question
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to ask a question." }, { status: 401 });
  }

  const body = await req.json();
  const { title, bodyText, tags, standardRef, postType } = body;

  // Validate postType
  const validPostTypes = ["QUESTION", "FACT", "TERM"];
  const resolvedPostType = postType && validPostTypes.includes(postType) ? postType : "QUESTION";

  // Adjust validation based on post type
  const minTitle = resolvedPostType === "TERM" ? 3 : 10;
  const minBody = resolvedPostType === "TERM" ? 10 : 20;

  if (!title || typeof title !== "string" || title.trim().length < minTitle) {
    return NextResponse.json({ error: `Title must be at least ${minTitle} characters.` }, { status: 400 });
  }
  if (!bodyText || typeof bodyText !== "string" || bodyText.trim().length < minBody) {
    return NextResponse.json({ error: `Body must be at least ${minBody} characters.` }, { status: 400 });
  }

  const cleanTags = Array.isArray(tags)
    ? tags.filter((t: unknown) => typeof t === "string").map((t: string) => t.trim().toLowerCase()).slice(0, 5)
    : [];

  const question = await prisma.question.create({
    data: {
      postType: resolvedPostType,
      title: title.trim(),
      body: bodyText.trim(),
      tags: cleanTags,
      standardRef: standardRef?.trim() || null,
      authorId: session.user.id,
    },
    include: {
      author: { select: { id: true, name: true, image: true, bemNumber: true, role: true } },
    },
  });

  return NextResponse.json(question, { status: 201 });
}
