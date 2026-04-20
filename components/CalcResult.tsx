"use client";

import { useState } from "react";

interface CalcResultProps {
  label: string;
  value: number | null;
  unit: string;
  /** Optional decimal places override (default: auto 4dp with exponential fallback) */
  decimals?: number;
  /** Hide the inline condensed disclaimer if the parent already shows one */
  hideInlineDisclaimer?: boolean;
  /** Hide the last-updated timestamp */
  hideTimestamp?: boolean;
}

function formatResult(value: number, decimals?: number): string {
  if (decimals !== undefined) return value.toFixed(decimals);
  if (value === 0) return "0.0000";
  if (Math.abs(value) > 0 && Math.abs(value) < 0.0001) {
    return value.toExponential(4);
  }
  return value.toFixed(4);
}

export default function CalcResult({
  label,
  value,
  unit,
  decimals,
  hideInlineDisclaimer,
  hideTimestamp,
}: CalcResultProps) {
  const [prevValue, setPrevValue] = useState<number | null>(value);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  if (prevValue !== value) {
    setPrevValue(value);
    if (value !== null && !Number.isNaN(value)) {
      setUpdatedAt(new Date());
    }
  }

  const timeStr = updatedAt
    ? updatedAt.toLocaleTimeString("en-MY", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="md:sticky md:top-4">
      <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 transition-all">
        <p className="text-sm font-medium text-amber-700">{label}</p>
        <p className="mt-1 text-3xl font-bold text-amber-900 break-all">
          {value !== null ? formatResult(value, decimals) : "—"}
          <span className="ml-2 text-base font-normal text-amber-600">
            {unit}
          </span>
        </p>

        {!hideTimestamp && value !== null && timeStr && (
          <p className="mt-2 text-[11px] text-amber-600/80">
            Calculated {timeStr}
          </p>
        )}

        {!hideInlineDisclaimer && (
          <p className="mt-3 border-t border-amber-200/70 pt-2 text-[11px] leading-relaxed text-amber-700/80">
            Engineering aid only — final design must be endorsed by a registered PE under BEM.
          </p>
        )}
      </div>
    </div>
  );
}
