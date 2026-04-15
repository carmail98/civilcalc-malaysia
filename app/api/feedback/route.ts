import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

const ADMIN_EMAIL = "ahmadkamilhakim98@gmail.com";

const VALID_CATEGORIES = [
  "CALCULATION_ERROR",
  "STANDARD_OUTDATED",
  "FEATURE_REQUEST",
  "UI_ISSUE",
  "OTHER",
] as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, message, pageUrl, email } = body;

    // Validate required fields
    if (!category || !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: "Invalid feedback category." },
        { status: 400 }
      );
    }
    if (!message || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters." },
        { status: 400 }
      );
    }
    if (message.trim().length > 2000) {
      return NextResponse.json(
        { error: "Message must be under 2000 characters." },
        { status: 400 }
      );
    }

    // Get current user if logged in
    const session = await auth();
    const userId = session?.user?.id ?? null;

    const feedback = await prisma.feedback.create({
      data: {
        category,
        message: message.trim(),
        pageUrl: pageUrl || null,
        email: userId ? null : email?.trim() || null,
        userId,
      },
    });

    // Send email notification to admin (non-blocking)
    if (process.env.RESEND_API_KEY) {
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "CivilCalc <onboarding@resend.dev>",
          to: ADMIN_EMAIL,
          subject: `[CivilCalc Feedback] ${category}`,
          html: `
            <h3>New Feedback Received</h3>
            <p><strong>Category:</strong> ${category}</p>
            ${pageUrl ? `<p><strong>Page:</strong> ${pageUrl}</p>` : ""}
            <p><strong>Message:</strong></p>
            <blockquote style="border-left:3px solid #d97706;padding-left:12px;color:#44403c">${message.trim()}</blockquote>
            <p style="color:#78716c;font-size:12px">
              From: ${userId ? "Logged-in user" : email?.trim() || "Anonymous"}<br/>
              ID: ${feedback.id}
            </p>
          `,
        }),
      }).catch(() => {}); // Silently fail — email is best-effort
    }

    return NextResponse.json(
      { success: true, id: feedback.id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to submit feedback. Please try again." },
      { status: 500 }
    );
  }
}
