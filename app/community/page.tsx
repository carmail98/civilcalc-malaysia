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

export default function CommunityPage() {
  const { data: session } = useSession();
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [sort, setSort] = useState("newest");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ sort, page: String(page) });
    if (activeTag) params.set("tag", activeTag);

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
  }, [sort, page, activeTag]);

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

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Q&A Forum</h1>
          <p className="text-sm text-gray-500 mt-1">
            {total} question{total !== 1 ? "s" : ""} from Malaysian civil engineers
          </p>
        </div>
        {session?.user && (
          <Link
            href="/community/ask"
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 transition-colors"
          >
            Ask a Question
          </Link>
        )}
        {!session?.user && (
          <Link
            href="/login"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Sign in to ask
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex rounded-lg border border-gray-200 p-0.5 text-sm">
          {[
            { key: "newest", label: "Newest" },
            { key: "votes", label: "Top Voted" },
            { key: "unanswered", label: "Unanswered" },
          ].map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => { setSort(s.key); setPage(1); }}
              className={`rounded-md px-3 py-1 font-medium transition-colors ${
                sort === s.key
                  ? "bg-blue-700 text-white"
                  : "text-gray-500 hover:text-gray-700"
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
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent"
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="text-center py-12 text-sm text-gray-400">Loading questions...</div>
      ) : questions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">No questions yet.</p>
          {session?.user && (
            <Link href="/community/ask" className="text-sm text-blue-700 hover:underline">
              Be the first to ask!
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <Link
              key={q.id}
              href={`/community/${q.id}`}
              className="block rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-200 hover:shadow-sm transition-all"
            >
              <div className="flex gap-4">
                {/* Stats */}
                <div className="hidden sm:flex flex-col items-center gap-1 text-xs text-gray-400 min-w-[60px] pt-1">
                  <div className={`font-semibold text-sm ${q.voteScore > 0 ? "text-blue-700" : q.voteScore < 0 ? "text-red-500" : "text-gray-400"}`}>
                    {q.voteScore} vote{q.voteScore !== 1 ? "s" : ""}
                  </div>
                  <div className={`rounded px-2 py-0.5 ${q._count.answers > 0 ? (q.isResolved ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600") : "text-gray-400"}`}>
                    {q._count.answers} ans
                  </div>
                  <div>{q.viewCount} views</div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold text-gray-900 mb-1 leading-snug">
                    {q.isResolved && (
                      <span className="inline-block mr-1.5 text-green-600" title="Resolved">&#10003;</span>
                    )}
                    {q.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {q.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
                        #{tag}
                      </span>
                    ))}
                    {q.standardRef && (
                      <span className="text-xs text-amber-600 bg-amber-50 rounded px-2 py-0.5">
                        {q.standardRef}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <span className="font-medium text-gray-600">{q.author.name}</span>
                    {q.author.bemNumber && (
                      <span className="text-blue-600 bg-blue-50 rounded px-1.5 py-0.5 text-[10px]">
                        PE
                      </span>
                    )}
                    <span>&middot;</span>
                    <span>{timeAgo(q.createdAt)}</span>

                    {/* Mobile stats */}
                    <span className="sm:hidden">&middot;</span>
                    <span className="sm:hidden">{q.voteScore} votes</span>
                    <span className="sm:hidden">&middot;</span>
                    <span className="sm:hidden">{q._count.answers} answers</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {pages}
          </span>
          <button
            type="button"
            disabled={page >= pages}
            onClick={() => setPage(page + 1)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
