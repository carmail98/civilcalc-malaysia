interface CalcResultProps {
  label: string;
  value: number | null;
  unit: string;
  /** Optional decimal places override (default: auto 4dp with exponential fallback) */
  decimals?: number;
}

function formatResult(value: number, decimals?: number): string {
  if (decimals !== undefined) return value.toFixed(decimals);
  if (value === 0) return "0.0000";
  if (Math.abs(value) > 0 && Math.abs(value) < 0.0001) {
    return value.toExponential(4);
  }
  return value.toFixed(4);
}

export default function CalcResult({ label, value, unit, decimals }: CalcResultProps) {
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
      </div>
    </div>
  );
}
