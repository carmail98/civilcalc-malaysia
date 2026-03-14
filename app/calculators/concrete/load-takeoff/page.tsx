"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { loadTakeOff } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";

const data = formulaData.load_takeoff;

// Typical imposed loads per EC1 Table 6.1
const imposedLoadPresets = [
  { label: "Residential (1.5 kN/m²)", value: 1.5 },
  { label: "Residential (2.0 kN/m²)", value: 2.0 },
  { label: "Office (2.5 kN/m²)", value: 2.5 },
  { label: "Office (3.0 kN/m²)", value: 3.0 },
  { label: "Retail / Assembly (4.0 kN/m²)", value: 4.0 },
  { label: "Storage (7.5 kN/m²)", value: 7.5 },
  { label: "Roof — accessible (1.5 kN/m²)", value: 1.5 },
  { label: "Roof — not accessible (0.75 kN/m²)", value: 0.75 },
  { label: "Custom", value: -1 },
];

export default function LoadTakeOffPage() {
  const [thickness, setThickness] = useState("");
  const [finishes, setFinishes] = useState("1.2");
  const [imposed, setImposed] = useState("1.5");
  const [imposedPreset, setImposedPreset] = useState("1.5");
  const [tribWidth, setTribWidth] = useState("");

  const tVal = parseFloat(thickness);
  const fVal = parseFloat(finishes);
  const iVal = parseFloat(imposed);
  const twVal = parseFloat(tribWidth);

  const { savedList, save, remove, clearAll } = useCalcStorage("load-takeoff");

  // Validation
  const tError =
    thickness !== "" && !isNaN(tVal)
      ? tVal < 50
        ? "Slab thickness typically ≥ 50 mm"
        : tVal > 500
        ? "Check slab thickness — exceeds 500 mm"
        : undefined
      : undefined;
  const fError =
    finishes !== "" && !isNaN(fVal) && fVal < 0
      ? "Load cannot be negative"
      : undefined;
  const iError =
    imposed !== "" && !isNaN(iVal) && iVal < 0
      ? "Load cannot be negative"
      : undefined;
  const twError =
    tribWidth !== "" && !isNaN(twVal) && twVal <= 0
      ? "Tributary width must be positive"
      : undefined;

  const hasErrors = !!tError || !!fError || !!iError || !!twError;
  const allValid =
    !isNaN(tVal) &&
    !isNaN(fVal) &&
    !isNaN(iVal) &&
    !isNaN(twVal) &&
    tVal > 0 &&
    twVal > 0 &&
    !hasErrors;

  const result = allValid ? loadTakeOff(tVal, fVal, iVal, twVal) : null;

  const handlePresetChange = (presetValue: string) => {
    setImposedPreset(presetValue);
    if (presetValue !== "-1") {
      setImposed(presetValue);
    }
  };

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{data.name}</h1>
        <p className="text-sm text-gray-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { thickness, finishes, imposed, imposedPreset, tribWidth })}
          onLoad={(v) => { setThickness(v.thickness ?? ""); setFinishes(v.finishes ?? "1.2"); setImposed(v.imposed ?? "1.5"); setImposedPreset(v.imposedPreset ?? "1.5"); setTribWidth(v.tribWidth ?? ""); }}
          onRemove={remove}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />

        {/* Load combination note */}
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 mb-6">
          <p className="text-sm text-gray-700">
            <strong>ULS Load Combination:</strong> w = 1.35G<sub>k</sub> + 1.5Q<sub>k</sub> (MS EN 1990, Eq. 6.10)
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Slab self-weight = 24 kN/m³ × thickness (RC unit weight per EC1)
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <CalcInput
              name="thickness"
              label={data.variables.thickness.label}
              unit={data.variables.thickness.unit}
              hint={data.variables.thickness.hint}
              value={thickness}
              onChange={setThickness}
              min={0}
              error={tError}
            />
            <CalcInput
              name="finishes"
              label={data.variables.finishes.label}
              unit={data.variables.finishes.unit}
              hint={data.variables.finishes.hint}
              value={finishes}
              onChange={setFinishes}
              min={0}
              error={fError}
            />

            {/* Imposed load preset */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Occupancy Type (EC1 Table 6.1)
              </label>
              <select
                value={imposedPreset}
                onChange={(e) => handlePresetChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500"
              >
                {imposedLoadPresets.map((p) => (
                  <option key={p.label} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <CalcInput
              name="imposed"
              label={data.variables.imposed.label}
              unit={data.variables.imposed.unit}
              hint={data.variables.imposed.hint}
              value={imposed}
              onChange={setImposed}
              min={0}
              error={iError}
            />
            <CalcInput
              name="tribWidth"
              label={data.variables.tribWidth.label}
              unit={data.variables.tribWidth.unit}
              hint={data.variables.tribWidth.hint}
              value={tribWidth}
              onChange={setTribWidth}
              min={0}
              error={twError}
            />

            {allValid && result !== null && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: data.formula,
                  inputs: [
                    { label: data.variables.thickness.label, value: thickness, unit: data.variables.thickness.unit },
                    { label: data.variables.finishes.label, value: finishes, unit: data.variables.finishes.unit },
                    { label: data.variables.imposed.label, value: imposed, unit: data.variables.imposed.unit },
                    { label: data.variables.tribWidth.label, value: tribWidth, unit: data.variables.tribWidth.unit },
                    { label: "Slab Self-Weight", value: result.slabSW.toFixed(2), unit: "kN/m²" },
                    { label: "Total Dead Load (Gk)", value: result.Gk.toFixed(2), unit: "kN/m²" },
                    { label: "Imposed Load (Qk)", value: result.Qk.toFixed(2), unit: "kN/m²" },
                  ],
                  result: {
                    label: `ULS: ${result.ULS.toFixed(2)} kN/m² | Line Load: ${result.lineLoad.toFixed(2)} kN/m`,
                    value: result.lineLoad.toFixed(4),
                    unit: "kN/m",
                  },
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            {result && (
              <>
                <CalcResult
                  label="Slab Self-Weight"
                  value={result.slabSW}
                  unit="kN/m²"
                />
                <CalcResult
                  label="Total Dead Load (Gk)"
                  value={result.Gk}
                  unit="kN/m²"
                />
                <CalcResult
                  label="Imposed Load (Qk)"
                  value={result.Qk}
                  unit="kN/m²"
                />
                <CalcResult
                  label={data.result.ULS.label}
                  value={result.ULS}
                  unit={data.result.ULS.unit}
                />
                <CalcResult
                  label={data.result.lineLoad.label}
                  value={result.lineLoad}
                  unit={data.result.lineLoad.unit}
                />
              </>
            )}
            {!result && (
              <>
                <CalcResult label={data.result.ULS.label} value={null} unit={data.result.ULS.unit} />
                <CalcResult label={data.result.lineLoad.label} value={null} unit={data.result.lineLoad.unit} />
              </>
            )}
          </div>
        </div>

        <Disclaimer text={data.disclaimer} />
      </div>

      {/* Print view */}
      {allValid && result !== null && (
        <PrintNote
          title={data.name}
          reference={data.reference}
          formula={data.formula}
          inputs={[
            { label: data.variables.thickness.label, value: thickness, unit: data.variables.thickness.unit },
            { label: data.variables.finishes.label, value: finishes, unit: data.variables.finishes.unit },
            { label: data.variables.imposed.label, value: imposed, unit: data.variables.imposed.unit },
            { label: data.variables.tribWidth.label, value: tribWidth, unit: data.variables.tribWidth.unit },
            { label: "Slab Self-Weight", value: result.slabSW.toFixed(2), unit: "kN/m²" },
            { label: "Total Dead Load (Gk)", value: result.Gk.toFixed(2), unit: "kN/m²" },
            { label: "Imposed Load (Qk)", value: result.Qk.toFixed(2), unit: "kN/m²" },
          ]}
          result={{
            label: `ULS: ${result.ULS.toFixed(2)} kN/m² | Line Load: ${result.lineLoad.toFixed(2)} kN/m`,
            value: result.lineLoad.toFixed(4),
            unit: "kN/m",
          }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
