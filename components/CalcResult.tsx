interface CalcResultProps {
  label: string;
  value: number | null;
  unit: string;
}

function formatResult(value: number): string {
  if (value === 0) return "0.0000";
  if (Math.abs(value) > 0 && Math.abs(value) < 0.0001) {
    return value.toExponential(4);
  }
  return value.toFixed(4);
}

export default function CalcResult({ label, value, unit }: CalcResultProps) {
  return (
    <div className="md:sticky md:top-4">
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 transition-all">
        <p className="text-sm font-medium text-blue-700">{label}</p>
        <p className="mt-1 text-3xl font-bold text-blue-900 break-all">
          {value !== null ? formatResult(value) : "—"}
          <span className="ml-2 text-base font-normal text-blue-600">
            {unit}
          </span>
        </p>
      </div>
    </div>
  );
}
