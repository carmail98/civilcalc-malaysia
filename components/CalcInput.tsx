"use client";

interface CalcInputProps {
  label: string;
  unit: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  name: string;
}

export default function CalcInput({
  label,
  unit,
  hint,
  value,
  onChange,
  name,
}: CalcInputProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {unit && <span className="text-gray-400">({unit})</span>}
      </label>
      <input
        id={name}
        name={name}
        type="number"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder={hint}
      />
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
