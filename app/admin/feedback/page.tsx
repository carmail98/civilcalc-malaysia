import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const ADMIN_EMAILS = ["ahmadkamilhakim98@gmail.com", "kamilhakim@bina.cloud"];

const categoryLabels: Record<string, string> = {
  CALCULATION_ERROR: "Calculation Error",
  STANDARD_OUTDATED: "Standard Outdated",
  FEATURE_REQUEST: "Feature Request",
  UI_ISSUE: "UI Issue",
  OTHER: "Other",
};

const statusColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  REVIEWING: "bg-amber-100 text-amber-700",
  RESOLVED: "bg-green-100 text-green-700",
  WONT_FIX: "bg-stone-100 text-stone-500",
};

export default async function AdminFeedbackPage() {
  const session = await auth();

  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    redirect("/login");
  }

  const feedbacks = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true, bemNumber: true } } },
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Feedback Dashboard</h1>
          <p className="text-sm text-stone-500">
            {feedbacks.length} submission{feedbacks.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
          Admin Only
        </span>
      </div>

      {feedbacks.length === 0 ? (
        <div className="text-center py-16 text-stone-400 text-sm">
          No feedback yet. Submissions will appear here.
        </div>
      ) : (
        <div className="space-y-3">
          {feedbacks.map((fb) => (
            <div
              key={fb.id}
              className="rounded-xl border border-stone-200 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[fb.status] || statusColors.NEW}`}>
                    {fb.status}
                  </span>
                  <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
                    {categoryLabels[fb.category] || fb.category}
                  </span>
                  {fb.pageUrl && (
                    <span className="text-xs text-stone-400">
                      Page: {fb.pageUrl}
                    </span>
                  )}
                </div>
                <time className="text-xs text-stone-400 whitespace-nowrap">
                  {new Date(fb.createdAt).toLocaleDateString("en-MY", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>

              <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">
                {fb.message}
              </p>

              <div className="mt-3 pt-3 border-t border-stone-100 text-xs text-stone-400">
                {fb.user ? (
                  <span>
                    From: <strong className="text-stone-600">{fb.user.name}</strong> ({fb.user.email})
                    {fb.user.bemNumber && <span className="ml-1">| BEM: {fb.user.bemNumber}</span>}
                  </span>
                ) : fb.email ? (
                  <span>From: {fb.email} (anonymous)</span>
                ) : (
                  <span>Anonymous (no email)</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
