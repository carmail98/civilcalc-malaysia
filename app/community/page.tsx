"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface QuestionAuthor {
  id: string;
  name: string;
  image: string | null;
  bemNumber: string | null;
  role: string;
}

interface QuestionItem {
  id: string;
  postType: "QUESTION" | "FACT" | "TERM";
  title: string;
  tags: string[];
  standardRef: string | null;
  isResolved: boolean;
  viewCount: number;
  voteScore: number;
  createdAt: string;
  author: QuestionAuthor;
  _count: { answers: number; votes: number };
}

const POPULAR_TAGS = [
  "msma", "ec2", "jkr", "drainage", "structural",
  "geotechnical", "retaining-wall", "pavement", "sewerage",
];

const POST_TYPE_TABS = [
  { key: null, label: "All", icon: null },
  { key: "QUESTION", label: "Questions", icon: "?" },
  { key: "FACT", label: "Did You Know?", icon: "!" },
  { key: "TERM", label: "Key Terms", icon: "A" },
] as const;

const POST_TYPE_BADGE: Record<string, { label: string; className: string }> = {
  QUESTION: { label: "Q&A", className: "bg-blue-50 text-blue-600 border-blue-200" },
  FACT: { label: "Fact", className: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  TERM: { label: "Term", className: "bg-violet-50 text-violet-600 border-violet-200" },
};

export default function CommunityPage() {
  const { data: session } = useSession();
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [sort, setSort] = useState("newest");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activePostType, setActivePostType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ sort, page: String(page) });
    if (activeTag) params.set("tag", activeTag);
    if (activePostType) params.set("postType", activePostType);

    try {
      const res = await fetch(`/api/questions?${params}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setQuestions(data.questions || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch {
      // silently handle fetch errors
    }
    setLoading(false);
  }, [sort, page, activeTag, activePostType]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString("en-MY");
  }

  // Dynamic header based on active post type
  const headerText = activePostType === "FACT"
    ? "Did You Know?"
    : activePostType === "TERM"
    ? "Engineering Terms"
    : "Community";

  const headerSubtext = activePostType === "FACT"
    ? "Engineering facts and insights shared by Malaysian civil engineers"
    : activePostType === "TERM"
    ? "Glossary of civil engineering terms in Malaysian context"
    : `${total} post${total !== 1 ? "s" : ""} from Malaysian civil engineers`;

  // Dynamic CTA label
  const ctaLabel = activePostType === "FACT"
    ? "Share a Fact"
    : activePostType === "TERM"
    ? "Add a Term"
    : "Ask a Question";

  const ctaHref = activePostType
    ? `/community/ask?type=${activePostType}`
    : "/community/ask";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">{headerText}</h1>
          <p className="text-sm text-stone-500 mt-1">{headerSubtext}</p>
        </div>
        {session?.user && (
          <Link
            href={ctaHref}
            className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800 transition-colors"
          >
            {ctaLabel}
          </Link>
        )}
        {!session?.user && (
          <Link
            href="/login"
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            Sign in to contribute
          </Link>
        )}
      </div>

      {/* Post Type Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {POST_TYPE_TABS.map((tab) => (
          <button
            key={tab.key ?? "all"}
            type="button"
            onClick={() => { setActivePostType(tab.key); setPage(1); }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              activePostType === tab.key
                ? "bg-amber-700 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {tab.icon && (
              <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                activePostType === tab.key
                  ? "bg-amber-600 text-white"
                  : "bg-stone-200 text-stone-500"
              }`}>
                {tab.icon}
              </span>
            )}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sort Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex rounded-lg border border-stone-200 p-0.5 text-sm">
          {[
            { key: "newest", label: "Newest" },
            { key: "votes", label: "Top Voted" },
            ...(activePostType !== "FACT" && activePostType !== "TERM"
              ? [{ key: "unanswered", label: "Unanswered" }]
              : []),
          ].map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => { setSort(s.key); setPage(1); }}
              className={`rounded-md px-3 py-1 font-medium transition-colors ${
                sort === s.key
                  ? "bg-amber-700 text-white"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {POPULAR_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => { setActiveTag(activeTag === tag ? null : tag); setPage(1); }}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeTag === tag
                ? "bg-amber-100 text-amber-700 border border-amber-200"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200 border border-transparent"
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="text-center py-12 text-sm text-stone-400">Loading...</div>
      ) : questions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-stone-500 mb-2">
            {activePostType === "FACT"
              ? "No facts shared yet."
              : activePostType === "TERM"
              ? "No terms added yet."
              : "No posts yet."}
          </p>
          {session?.user && (
            <Link href={ctaHref} className="text-sm text-amber-700 hover:underline">
              Be the first to contribute!
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => {
            const badge = POST_TYPE_BADGE[q.postType] || POST_TYPE_BADGE.QUESTION;
            const isFact = q.postType === "FACT";
            const isTerm = q.postType === "TERM";

            return (
              <Link
                key={q.id}
                href={`/community/${q.id}`}
                className={`block rounded-lg border bg-white p-4 hover:shadow-sm transition-all ${
                  isFact
                    ? "border-emerald-200 hover:border-emerald-300"
                    : isTerm
                    ? "border-violet-200 hover:border-violet-300"
                    : "border-stone-200 hover:border-amber-200"
                }`}
              >
                <div className="flex gap-4">
                  {/* Stats — only show for questions */}
                  {!isFact && !isTerm && (
                    <div className="hidden sm:flex flex-col items-center gap-1 text-xs text-stone-400 min-w-[60px] pt-1">
                      <div className={`font-semibold text-sm ${q.voteScore > 0 ? "text-amber-700" : q.voteScore < 0 ? "text-red-500" : "text-stone-400"}`}>
                        {q.voteScore} vote{q.voteScore !== 1 ? "s" : ""}
                      </div>
                      <div className={`rounded px-2 py-0.5 ${q._count.answers > 0 ? (q.isResolved ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-600") : "text-stone-400"}`}>
                        {q._count.answers} ans
                      </div>
                      <div>{q.viewCount} views</div>
                    </div>
                  )}

                  {/* Fact/Term icon */}
                  {(isFact || isTerm) && (
                    <div className="hidden sm:flex items-start pt-1">
                      <span className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${
                        isFact ? "bg-emerald-100 text-emerald-600" : "bg-violet-100 text-violet-600"
                      }`}>
                        {isFact ? "!" : "A"}
                      </span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {/* Post type badge (when showing all types) */}
                      {!activePostType && (
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold border ${badge.className}`}>
                          {badge.label}
                        </span>
                      )}
                      <h2 className="text-sm font-semibold text-stone-800 leading-snug">
                        {q.postType === "QUESTION" && q.isResolved && (
                          <span className="inline-block mr-1.5 text-green-600" title="Resolved">&#10003;</span>
                        )}
                        {q.title}
                      </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {q.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-600">
                          #{tag}
                        </span>
                      ))}
                      {q.standardRef && (
                        <span className="text-xs text-amber-600 bg-amber-50 rounded px-2 py-0.5">
                          {q.standardRef}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-2 text-xs text-stone-400">
                      <span className="font-medium text-stone-600">{q.author.name}</span>
                      {q.author.bemNumber && (
                        <span className="text-amber-600 bg-amber-50 rounded px-1.5 py-0.5 text-[10px]">
                          PE
                        </span>
                      )}
                      <span>&middot;</span>
                      <span>{timeAgo(q.createdAt)}</span>

                      {/* Vote/answer stats for facts & terms */}
                      {(isFact || isTerm) && q.voteScore > 0 && (
                        <>
                          <span>&middot;</span>
                          <span className="text-amber-600">{q.voteScore} vote{q.voteScore !== 1 ? "s" : ""}</span>
                        </>
                      )}

                      {/* Mobile stats for questions */}
                      {!isFact && !isTerm && (
                        <>
                          <span className="sm:hidden">&middot;</span>
                          <span className="sm:hidden">{q.voteScore} votes</span>
                          <span className="sm:hidden">&middot;</span>
                          <span className="sm:hidden">{q._count.answers} answers</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-stone-500">
            Page {page} of {pages}
          </span>
          <button
            type="button"
            disabled={page >= pages}
            onClick={() => setPage(page + 1)}
            className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
