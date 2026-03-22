"use client";

import { Suspense, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const SUGGESTED_TAGS = [
  "msma", "ec2", "jkr", "drainage", "structural", "geotechnical",
  "retaining-wall", "pavement", "sewerage", "hydraulic", "slope",
  "foundation", "soil", "concrete", "steel", "earthworks",
];

const POST_TYPES = [
  {
    key: "QUESTION",
    label: "Question",
    description: "Ask the community for help",
    icon: "?",
    iconBg: "bg-blue-100 text-blue-600",
    titlePlaceholder: "e.g. How to size a detention pond for 100-year ARI using MSMA?",
    bodyPlaceholder: "Describe your question in detail. Include site conditions, design parameters, and what you've already tried...",
    titleLabel: "Title",
    bodyLabel: "Details",
  },
  {
    key: "FACT",
    label: "Did You Know?",
    description: "Share an engineering fact or insight",
    icon: "!",
    iconBg: "bg-emerald-100 text-emerald-600",
    titlePlaceholder: "e.g. Malaysian laterite soil has a typical CBR of 15-30% after soaking",
    bodyPlaceholder: "Explain the fact in detail. Include the source, why it matters, and how it applies in Malaysian civil engineering practice...",
    titleLabel: "Fact Title",
    bodyLabel: "Explanation",
  },
  {
    key: "TERM",
    label: "Key Term",
    description: "Define an engineering term",
    icon: "A",
    iconBg: "bg-violet-100 text-violet-600",
    titlePlaceholder: "e.g. Freeboard",
    bodyPlaceholder: "Define this term clearly. Include its significance in Malaysian engineering practice, typical values, and which standards reference it...",
    titleLabel: "Term",
    bodyLabel: "Definition",
  },
] as const;

export default function AskQuestionPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-sm text-stone-400">Loading...</div>}>
      <AskQuestionForm />
    </Suspense>
  );
}

function AskQuestionForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial post type from URL query
  const initialType = searchParams.get("type");
  const validInitialType = initialType && ["QUESTION", "FACT", "TERM"].includes(initialType)
    ? initialType
    : "QUESTION";

  const [postType, setPostType] = useState(validInitialType);
  const [title, setTitle] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [standardRef, setStandardRef] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const typeConfig = POST_TYPES.find((t) => t.key === postType) || POST_TYPES[0];

  if (status === "loading") {
    return <div className="text-center py-12 text-sm text-stone-400">Loading...</div>;
  }

  if (!session?.user) {
    return (
      <div className="text-center py-16">
        <h1 className="text-xl font-bold text-stone-800 mb-3">Sign in to contribute</h1>
        <Link href="/login" className="text-sm text-amber-700 hover:underline">
          Go to sign in
        </Link>
      </div>
    );
  }

  function addTag(tag: string) {
    const clean = tag.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (clean && !tags.includes(clean) && tags.length < 5) {
      setTags([...tags, clean]);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  function handleTagKeyDown(e: React.KeyboardEvent) {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput);
    }
    if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        bodyText,
        tags,
        standardRef: standardRef || undefined,
        postType,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to post.");
      return;
    }

    router.push(`/community/${data.id}`);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-stone-800 mb-1">
        {postType === "FACT" ? "Share a Fact" : postType === "TERM" ? "Add a Term" : "Ask a Question"}
      </h1>
      <p className="text-sm text-stone-500 mb-6">
        {postType === "FACT"
          ? "Share engineering knowledge with the Malaysian civil engineering community."
          : postType === "TERM"
          ? "Help build a glossary of civil engineering terms for Malaysian practice."
          : "Get help from Malaysian civil engineers. Be specific and include relevant standards."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Post Type Selector */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Post Type
          </label>
          <div className="flex gap-2">
            {POST_TYPES.map((type) => (
              <button
                key={type.key}
                type="button"
                onClick={() => setPostType(type.key)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all border ${
                  postType === type.key
                    ? "border-amber-300 bg-amber-50 text-amber-800"
                    : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                }`}
              >
                <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${type.iconBg}`}>
                  {type.icon}
                </span>
                <span className="hidden sm:inline">{type.label}</span>
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-stone-400">{typeConfig.description}</p>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            {typeConfig.titleLabel} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            placeholder={typeConfig.titlePlaceholder}
          />
          <p className="mt-1 text-xs text-stone-400">
            {postType === "TERM" ? "Minimum 3 characters." : "Minimum 10 characters. Be specific."}
          </p>
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            {typeConfig.bodyLabel} <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={postType === "TERM" ? 5 : 8}
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-y"
            placeholder={typeConfig.bodyPlaceholder}
          />
          <p className="mt-1 text-xs text-stone-400">
            {postType === "TERM" ? "Minimum 10 characters." : "Minimum 20 characters."}
          </p>
        </div>

        {/* Standard Reference */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Standard Reference <span className="text-stone-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={standardRef}
            onChange={(e) => setStandardRef(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            placeholder="e.g. MSMA 2nd Ed, Section 4.3"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Tags <span className="text-stone-400 font-normal">(up to 5)</span>
          </label>
          <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-stone-300 px-3 py-2 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700"
              >
                #{tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                  &times;
                </button>
              </span>
            ))}
            {tags.length < 5 && (
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="flex-1 min-w-[120px] text-sm outline-none border-none"
                placeholder={tags.length === 0 ? "Type a tag and press Enter" : "Add more..."}
              />
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {SUGGESTED_TAGS.filter((t) => !tags.includes(t)).slice(0, 8).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => addTag(tag)}
                className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500 hover:bg-stone-200 transition-colors"
              >
                +{tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-amber-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-50 transition-colors"
          >
            {loading
              ? "Posting..."
              : postType === "FACT"
              ? "Share Fact"
              : postType === "TERM"
              ? "Add Term"
              : "Post Question"}
          </button>
          <Link href="/community" className="text-sm text-stone-500 hover:text-stone-700">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
