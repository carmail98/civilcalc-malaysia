interface FormulaBoxProps {
  formula: string;
  reference: string;
}

export default function FormulaBox({ formula, reference }: FormulaBoxProps) {
  return (
    <div className="rounded-lg bg-gray-100 border border-gray-200 p-4 mb-6">
      <p className="text-lg font-mono font-semibold text-gray-800">
        {formula}
      </p>
      <p className="mt-1 text-xs text-gray-500">Ref: {reference}</p>
    </div>
  );
}
