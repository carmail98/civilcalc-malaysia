"use client";

import { Suspense, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const categories = [
  {
    value: "CALCULATION_ERROR",
    label: "Calculation Error",
    desc: "Wrong formula, incorrect result, or unit mismatch",
  },
  {
    value: "STANDARD_OUTDATED",
    label: "Standard Outdated",
    desc: "Referenced standard needs updating (MSMA, JKR, etc.)",
  },
  {
    value: "FEATURE_REQUEST",
    label: "Feature Request",
    desc: "New calculator, feature, or improvement suggestion",
  },
  {
    value: "UI_ISSUE",
    label: "UI / Display Issue",
    desc: "Layout problem, broken display, or usability issue",
  },
  {
    value: "OTHER",
    label: "Other",
    desc: "General feedback or comment",
  },
];

const PREFILL_MESSAGES: Record<string, string> = {
  "calculator-request":
    "Calculator request: \n\nStandard / reference: \n\nTypical inputs: \n\nExpected output: \n\nWhy this is needed: ",
  "broken-link":
    "Broken link report:\n\nURL attempted: \n\nWhere I clicked from: \n\nWhat I expected: ",
};

const VALID_CATEGORIES = new Set([
  "CALCULATION_ERROR",
  "STANDARD_OUTDATED",
  "FEATURE_REQUEST",
  "UI_ISSUE",
  "OTHER",
]);

export default function FeedbackPage() {
  return (
    <Suspense fallback={null}>
      <FeedbackForm />
    </Suspense>
  );
}

function FeedbackForm() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const initialCategory = (() => {
    const c = searchParams.get("category");
    return c && VALID_CATEGORIES.has(c) ? c : "";
  })();
  const initialTopic = searchParams.get("topic") ?? "";
  const initialMessage = initialTopic ? PREFILL_MESSAGES[initialTopic] ?? "" : "";

  const [category, setCategory] = useState(initialCategory);
  const [message, setMessage] = useState(initialMessage);
  const [pageUrl, setPageUrl] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, message, pageUrl, email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setCategory("");
      setMessage("");
      setPageUrl("");
      setEmail("");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-stone-800 mb-1">Send Feedback</h1>
      <p className="text-sm text-stone-500 mb-6">
        Help us improve CivilCalc. Report calculation errors, suggest new
        features, or let us know about any issues you encounter.
      </p>

      {status === "success" ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
          <div className="text-3xl mb-2">&#10003;</div>
          <h2 className="text-lg font-semibold text-green-800 mb-1">
            Thank you for your feedback!
          </h2>
          <p className="text-sm text-green-700 mb-4">
            We&apos;ll review your submission and take action if needed.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="text-sm font-medium text-amber-600 hover:text-amber-800"
          >
            Submit another feedback
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category */}
          <fieldset>
            <legend className="text-sm font-semibold text-stone-700 mb-2">
              Category <span className="text-red-500">*</span>
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {categories.map((cat) => (
                <label
                  key={cat.value}
                  className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                    category === cat.value
                      ? "border-amber-500 bg-amber-50"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat.value}
                    checked={category === cat.value}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="text-sm font-medium text-stone-800">
                      {cat.label}
                    </div>
                    <div className="text-xs text-stone-500">{cat.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Page URL */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1">
              Related Page (optional)
            </label>
            <input
              type="text"
              value={pageUrl}
              onChange={(e) => setPageUrl(e.target.value)}
              placeholder="e.g. /calculators/drainage/rational-method"
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
            />
            <p className="text-xs text-stone-400 mt-1">
              Which calculator or page is this about?
            </p>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1">
              Your Feedback <span className="text-red-500">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Describe the issue or suggestion in detail. For calculation errors, please include the inputs you used and the expected vs. actual result."
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none resize-y"
              maxLength={2000}
            />
            <p className="text-xs text-stone-400 mt-1 text-right">
              {message.length}/2000
            </p>
          </div>

          {/* Email for anonymous users */}
          {!session?.user && (
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">
                Email (optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
              />
              <p className="text-xs text-stone-400 mt-1">
                So we can follow up if needed. Not required.
              </p>
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!category || message.trim().length < 10 || status === "sending"}
            className="w-full rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === "sending" ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      )}
    </div>
  );
}
