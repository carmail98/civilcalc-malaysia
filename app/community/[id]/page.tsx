"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Author {
  id: string;
  name: string;
  image: string | null;
  bemNumber: string | null;
  role: string;
}

interface VoteData {
  value: number;
  userId: string;
}

interface AnswerData {
  id: string;
  body: string;
  isAccepted: boolean;
  createdAt: string;
  author: Author;
  votes: VoteData[];
  voteScore: number;
}

interface QuestionData {
  id: string;
  postType: "QUESTION" | "FACT" | "TERM";
  title: string;
  body: string;
  tags: string[];
  standardRef: string | null;
  isResolved: boolean;
  viewCount: number;
  voteScore: number;
  createdAt: string;
  author: Author;
  answers: AnswerData[];
  votes: VoteData[];
}

const POST_TYPE_LABEL: Record<string, { label: string; className: string }> = {
  QUESTION: { label: "Question", className: "bg-blue-50 text-blue-600 border-blue-200" },
  FACT: { label: "Did You Know?", className: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  TERM: { label: "Engineering Term", className: "bg-violet-50 text-violet-600 border-violet-200" },
};

function VoteButton({
  score,
  userVote,
  onVote,
  disabled,
}: {
  score: number;
  userVote: number | null;
  onVote: (value: number) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onVote(1)}
        className={`p-1 rounded transition-colors ${
          userVote === 1
            ? "text-amber-700 bg-amber-50"
            : "text-stone-400 hover:text-amber-600 hover:bg-stone-100"
        } disabled:opacity-40`}
        title="Upvote"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
      <span className={`text-sm font-semibold ${score > 0 ? "text-amber-700" : score < 0 ? "text-red-500" : "text-stone-400"}`}>
        {score}
      </span>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onVote(-1)}
        className={`p-1 rounded transition-colors ${
          userVote === -1
            ? "text-red-500 bg-red-50"
            : "text-stone-400 hover:text-red-500 hover:bg-stone-100"
        } disabled:opacity-40`}
        title="Downvote"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>
  );
}

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

export default function QuestionDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const questionId = params.id as string;

  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Answer form
  const [answerBody, setAnswerBody] = useState("");
  const [answerLoading, setAnswerLoading] = useState(false);
  const [answerError, setAnswerError] = useState("");

  const fetchQuestion = useCallback(async () => {
    const res = await fetch(`/api/questions/${questionId}`);
    if (!res.ok) {
      setError("Post not found.");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setQuestion(data);
    setLoading(false);
  }, [questionId]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  function getUserVote(votes: VoteData[]) {
    if (!session?.user?.id) return null;
    const v = votes.find((v) => v.userId === session?.user?.id);
    return v ? v.value : null;
  }

  async function handleQuestionVote(value: number) {
    if (!session?.user) return;
    await fetch(`/api/questions/${questionId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    fetchQuestion();
  }

  async function handleAnswerVote(answerId: string, value: number) {
    if (!session?.user) return;
    await fetch(`/api/answers/${answerId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    fetchQuestion();
  }

  async function handleAccept(answerId: string) {
    if (!session?.user) return;
    await fetch(`/api/answers/${answerId}/accept`, { method: "POST" });
    fetchQuestion();
  }

  async function handleSubmitAnswer(e: React.FormEvent) {
    e.preventDefault();
    setAnswerError("");
    setAnswerLoading(true);

    const res = await fetch(`/api/questions/${questionId}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: answerBody }),
    });

    const data = await res.json();
    setAnswerLoading(false);

    if (!res.ok) {
      setAnswerError(data.error || "Failed to post.");
      return;
    }

    setAnswerBody("");
    fetchQuestion();
  }

  if (loading) {
    return <div className="text-center py-12 text-sm text-stone-400">Loading...</div>;
  }

  if (error || !question) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-500 mb-2">{error || "Post not found."}</p>
        <Link href="/community" className="text-sm text-amber-700 hover:underline">
          Back to Community
        </Link>
      </div>
    );
  }

  const isAuthor = session?.user?.id === question.author.id;
  const isFact = question.postType === "FACT";
  const isTerm = question.postType === "TERM";
  const isQuestion = question.postType === "QUESTION";
  const postLabel = POST_TYPE_LABEL[question.postType] || POST_TYPE_LABEL.QUESTION;

  // Dynamic labels for comment section
  const commentLabel = isQuestion ? "Answer" : "Comment";
  const commentPlural = isQuestion ? "Answers" : "Comments";

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="text-sm text-stone-400 mb-4">
        <Link href="/community" className="hover:text-amber-600">Community</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-600">
          {isFact ? "Fact" : isTerm ? "Term" : "Question"}
        </span>
      </div>

      {/* Post type badge */}
      <div className="mb-3">
        <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold border ${postLabel.className}`}>
          {postLabel.label}
        </span>
      </div>

      {/* Main content */}
      <div className="flex gap-4">
        <div className="hidden sm:block pt-1">
          <VoteButton
            score={question.voteScore}
            userVote={getUserVote(question.votes)}
            onVote={handleQuestionVote}
            disabled={!session?.user || isAuthor}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h1 className={`text-xl font-bold text-stone-800 mb-2 leading-snug ${
            isTerm ? "text-violet-900" : isFact ? "text-emerald-900" : ""
          }`}>
            {isQuestion && question.isResolved && (
              <span className="text-green-600 mr-2" title="Resolved">&#10003;</span>
            )}
            {question.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-stone-400">
            <span className="font-medium text-stone-600">{question.author.name}</span>
            {question.author.bemNumber && (
              <span className="text-amber-600 bg-amber-50 rounded px-1.5 py-0.5 text-[10px] font-medium">
                PE
              </span>
            )}
            <span>&middot;</span>
            <span>{isFact ? "Shared" : isTerm ? "Added" : "Asked"} {timeAgo(question.createdAt)}</span>
            <span>&middot;</span>
            <span>{question.viewCount} views</span>

            {/* Mobile vote */}
            <span className="sm:hidden">&middot;</span>
            <span className="sm:hidden font-medium text-stone-600">{question.voteScore} votes</span>
          </div>

          {/* Tags & standard */}
          <div className="flex flex-wrap gap-2 mb-4">
            {question.tags.map((tag) => (
              <Link
                key={tag}
                href={`/community?tag=${tag}`}
                className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs text-amber-600 hover:bg-amber-100"
              >
                #{tag}
              </Link>
            ))}
            {question.standardRef && (
              <span className="text-xs text-amber-600 bg-amber-50 rounded px-2.5 py-0.5">
                {question.standardRef}
              </span>
            )}
          </div>

          {/* Body — with special styling for terms */}
          {isTerm ? (
            <div className="rounded-lg border border-violet-200 bg-violet-50 p-4 mb-6">
              <div className="prose prose-sm max-w-none text-stone-700 whitespace-pre-wrap">
                {question.body}
              </div>
            </div>
          ) : isFact ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 mb-6">
              <div className="prose prose-sm max-w-none text-stone-700 whitespace-pre-wrap">
                {question.body}
              </div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none text-stone-700 whitespace-pre-wrap mb-6">
              {question.body}
            </div>
          )}
        </div>
      </div>

      {/* Answers/Comments section */}
      <div className="border-t border-stone-200 pt-6 mt-2">
        <h2 className="text-lg font-semibold text-stone-800 mb-4">
          {question.answers.length} {question.answers.length !== 1 ? commentPlural : commentLabel}
        </h2>

        {question.answers.length === 0 && (
          <p className="text-sm text-stone-400 mb-6">
            {isQuestion
              ? "No answers yet. Be the first to help!"
              : "No comments yet. Share your thoughts!"}
          </p>
        )}

        <div className="space-y-6">
          {question.answers.map((answer) => {
            const answerIsAuthor = session?.user?.id === answer.author.id;
            return (
              <div
                key={answer.id}
                className={`flex gap-4 rounded-lg p-4 ${
                  answer.isAccepted ? "bg-green-50 border border-green-200" : "bg-white border border-stone-200"
                }`}
              >
                <div className="hidden sm:flex flex-col items-center gap-1">
                  <VoteButton
                    score={answer.voteScore}
                    userVote={getUserVote(answer.votes)}
                    onVote={(v) => handleAnswerVote(answer.id, v)}
                    disabled={!session?.user || answerIsAuthor}
                  />
                  {answer.isAccepted && (
                    <span className="text-green-600 mt-1" title="Accepted answer">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                  {isAuthor && !answer.isAccepted && isQuestion && (
                    <button
                      type="button"
                      onClick={() => handleAccept(answer.id)}
                      className="text-stone-300 hover:text-green-500 mt-1 transition-colors"
                      title="Accept this answer"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="prose prose-sm max-w-none text-stone-700 whitespace-pre-wrap mb-3">
                    {answer.body}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-stone-400">
                    <span className="font-medium text-stone-600">{answer.author.name}</span>
                    {answer.author.bemNumber && (
                      <span className="text-amber-600 bg-amber-50 rounded px-1.5 py-0.5 text-[10px] font-medium">
                        PE
                      </span>
                    )}
                    <span>&middot;</span>
                    <span>{timeAgo(answer.createdAt)}</span>
                    {answer.isAccepted && (
                      <>
                        <span>&middot;</span>
                        <span className="text-green-600 font-medium">Accepted</span>
                      </>
                    )}

                    {/* Mobile vote & accept */}
                    <span className="sm:hidden">&middot;</span>
                    <span className="sm:hidden">{answer.voteScore} votes</span>
                    {isAuthor && !answer.isAccepted && isQuestion && (
                      <button
                        type="button"
                        onClick={() => handleAccept(answer.id)}
                        className="sm:hidden text-stone-400 hover:text-green-500 ml-1"
                      >
                        Accept
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Post answer/comment form */}
      <div className="border-t border-stone-200 pt-6 mt-6">
        <h3 className="text-base font-semibold text-stone-800 mb-3">
          Your {commentLabel}
        </h3>

        {!session?.user ? (
          <p className="text-sm text-stone-500">
            <Link href="/login" className="text-amber-700 hover:underline">Sign in</Link> to post {isQuestion ? "an answer" : "a comment"}.
          </p>
        ) : (
          <form onSubmit={handleSubmitAnswer} className="space-y-3">
            {answerError && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {answerError}
              </div>
            )}
            <textarea
              required
              rows={5}
              value={answerBody}
              onChange={(e) => setAnswerBody(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-y"
              placeholder={isQuestion
                ? "Share your knowledge. Reference standards where applicable..."
                : "Add your thoughts, corrections, or additional context..."}
            />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={answerLoading}
                className="rounded-lg bg-amber-700 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-50 transition-colors"
              >
                {answerLoading ? "Posting..." : `Post ${commentLabel}`}
              </button>
              <p className="text-xs text-stone-400">
                {isQuestion
                  ? "Answers from PE-registered engineers are highlighted."
                  : "Comments from PE-registered engineers are highlighted."}
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
