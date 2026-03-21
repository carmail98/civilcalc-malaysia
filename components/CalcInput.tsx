"use client";

interface CalcInputProps {
  label: string;
  unit: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  name: string;
  min?: number;
  max?: number;
  error?: string;
  warning?: string;
}

export default function CalcInput({
  label,
  unit,
  hint,
  value,
  onChange,
  name,
  min,
  max,
  error,
  warning,
}: CalcInputProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-stone-700 mb-1"
      >
        {label} {unit && <span className="text-stone-400">({unit})</span>}
      </label>
      <input
        id={name}
        name={name}
        type="number"
        step="any"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500"
            : warning
            ? "border-amber-400 focus:border-amber-500 focus:ring-amber-500"
            : "border-stone-300 focus:border-amber-500 focus:ring-amber-500"
        }`}
        placeholder={hint}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {warning && !error && <p className="mt-1 text-xs text-amber-600">{warning}</p>}
      {hint && !error && !warning && <p className="mt-1 text-xs text-stone-400">{hint}</p>}
    </div>
  );
}
