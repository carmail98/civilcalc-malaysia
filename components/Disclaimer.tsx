interface DisclaimerProps {
  text: string;
}

export default function Disclaimer({ text }: DisclaimerProps) {
  return (
    <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
      <strong>Disclaimer:</strong> {text}
    </div>
  );
}
