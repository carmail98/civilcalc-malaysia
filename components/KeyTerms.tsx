"use client";

import { useState } from "react";

export interface KeyTerm {
  term: string;
  definition: string;
  msContext?: string; // Malaysian-specific context
}

interface KeyTermsProps {
  terms: KeyTerm[];
  standard?: string; // e.g. "MSMA 2nd Edition"
}

export default function KeyTerms({ terms, standard }: KeyTermsProps) {
  const [open, setOpen] = useState(false);

  if (terms.length === 0) return null;

  return (
    <div className="rounded-lg border border-stone-200 bg-white mb-6">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-stone-50 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-amber-600"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <span className="text-sm font-semibold text-stone-700">
            Key Terms & Concepts
          </span>
          {standard && (
            <span className="text-xs text-amber-600 bg-amber-50 rounded px-2 py-0.5">
              {standard}
            </span>
          )}
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={`text-stone-400 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-stone-100 px-4 py-3 space-y-3">
          {terms.map((t) => (
            <div key={t.term} className="group">
              <dt className="text-sm font-semibold text-stone-800">
                {t.term}
              </dt>
              <dd className="text-sm text-stone-600 mt-0.5 leading-relaxed">
                {t.definition}
              </dd>
              {t.msContext && (
                <dd className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1 mt-1 inline-block">
                  Malaysian context: {t.msContext}
                </dd>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
