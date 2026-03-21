"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SUGGESTED_TAGS = [
  "msma", "ec2", "jkr", "drainage", "structural", "geotechnical",
  "retaining-wall", "pavement", "sewerage", "hydraulic", "slope",
  "foundation", "soil", "concrete", "steel", "earthworks",
];

export default function AskQuestionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [standardRef, setStandardRef] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (status === "loading") {
    return <div className="text-center py-12 text-sm text-stone-400">Loading...</div>;
  }

  if (!session?.user) {
    return (
      <div className="text-center py-16">
        <h1 className="text-xl font-bold text-stone-800 mb-3">Sign in to ask a question</h1>
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
      body: JSON.stringify({ title, bodyText, tags, standardRef: standardRef || undefined }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to post question.");
      return;
    }

    router.push(`/community/${data.id}`);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-stone-800 mb-1">Ask a Question</h1>
      <p className="text-sm text-stone-500 mb-6">
        Get help from Malaysian civil engineers. Be specific and include relevant standards.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            placeholder="e.g. How to size a detention pond for 100-year ARI using MSMA?"
          />
          <p className="mt-1 text-xs text-stone-400">Minimum 10 characters. Be specific.</p>
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Details <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={8}
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-y"
            placeholder="Describe your question in detail. Include site conditions, design parameters, and what you've already tried..."
          />
          <p className="mt-1 text-xs text-stone-400">Minimum 20 characters.</p>
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
            {loading ? "Posting..." : "Post Question"}
          </button>
          <Link href="/community" className="text-sm text-stone-500 hover:text-stone-700">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
