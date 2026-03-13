interface CalcResultProps {
  label: string;
  value: number | null;
  unit: string;
}

export default function CalcResult({ label, value, unit }: CalcResultProps) {
  return (
    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
      <p className="text-sm font-medium text-blue-700">{label}</p>
      <p className="mt-1 text-3xl font-bold text-blue-900">
        {value !== null ? value.toFixed(4) : "—"}
        <span className="ml-2 text-base font-normal text-blue-600">
          {unit}
        </span>
      </p>
    </div>
  );
}
