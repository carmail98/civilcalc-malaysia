"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { slopeGradient } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import KeyTerms from "@/components/KeyTerms";
import { keyTerms } from "@/data/key-terms";

const data = formulaData.slope_gradient;

export default function SlopePage() {
  const [vertical, setVertical] = useState("");
  const [horizontal, setHorizontal] = useState("");

  const vVal = parseFloat(vertical);
  const hVal = parseFloat(horizontal);

  const { savedList, save, remove, clearAll } = useCalcStorage("slope-gradient");

  const vError =
    vertical !== "" && !isNaN(vVal) && vVal < 0.01
      ? "Minimum vertical rise is 0.01 m"
      : undefined;
  const hError =
    horizontal !== "" && !isNaN(hVal) && hVal < 0.01
      ? "Minimum horizontal run is 0.01 m"
      : undefined;

  const hasErrors = !!vError || !!hError;
  const allValid =
    !isNaN(vVal) && !isNaN(hVal) && vVal >= 0.01 && hVal >= 0.01 && !hasErrors;

  const result = allValid ? slopeGradient(vVal, hVal) : null;

  // JKR advisory
  const advisory = result
    ? result.percentage > 100
      ? { level: "red" as const, text: "Exceeds 1:1 — not recommended without retaining structure" }
      : result.percentage > 50
      ? { level: "red" as const, text: "Exceeds 1:2 — detailed slope stability analysis required (JKR)" }
      : result.percentage > 25
      ? { level: "amber" as const, text: "Exceeds 1:4 — slope protection required" }
      : null
    : null;

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: "Earthworks", href: "/calculators/earthworks" }, { label: "Slope Gradient" }]} />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { vertical, horizontal })}
          onLoad={(v) => { setVertical(v.vertical ?? ""); setHorizontal(v.horizontal ?? ""); }}
          onRemove={remove}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />
        <KeyTerms terms={keyTerms["slope-gradient"].terms} standard={keyTerms["slope-gradient"].standard} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <CalcInput
              name="vertical"
              label={data.variables.vertical.label}
              unit={data.variables.vertical.unit}
              hint={data.variables.vertical.hint}
              value={vertical}
              onChange={setVertical}
              min={0.01}
              error={vError}
            />
            <CalcInput
              name="horizontal"
              label={data.variables.horizontal.label}
              unit={data.variables.horizontal.unit}
              hint={data.variables.horizontal.hint}
              value={horizontal}
              onChange={setHorizontal}
              min={0.01}
              error={hError}
            />

            {allValid && result !== null && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: data.formula,
                  inputs: [
                    { label: data.variables.vertical.label, value: vertical, unit: data.variables.vertical.unit },
                    { label: data.variables.horizontal.label, value: horizontal, unit: data.variables.horizontal.unit },
                  ],
                  result: {
                    label: "Slope",
                    value: `1 : ${result.ratio.toFixed(2)}  |  ${result.percentage.toFixed(1)}%  |  ${result.angle.toFixed(1)}°`,
                    unit: "",
                  },
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            <CalcResult
              label={data.result.ratio.label}
              value={result ? result.ratio : null}
              unit={result ? `(1 : ${result.ratio.toFixed(2)})` : ""}
            />
            <CalcResult
              label={data.result.percentage.label}
              value={result ? result.percentage : null}
              unit={data.result.percentage.unit}
            />
            <CalcResult
              label={data.result.angle.label}
              value={result ? result.angle : null}
              unit={data.result.angle.unit}
            />

            {advisory && (
              <div
                className={`rounded-2xl border p-3 text-sm ${
                  advisory.level === "red"
                    ? "border-red-200 bg-red-50 text-red-800"
                    : "border-amber-200 bg-amber-50 text-amber-800"
                }`}
              >
                {advisory.text}
              </div>
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
            { label: data.variables.vertical.label, value: vertical, unit: data.variables.vertical.unit },
            { label: data.variables.horizontal.label, value: horizontal, unit: data.variables.horizontal.unit },
          ]}
          result={{
            label: "Slope",
            value: `1 : ${result.ratio.toFixed(2)}  |  ${result.percentage.toFixed(1)}%  |  ${result.angle.toFixed(1)}°`,
            unit: "",
          }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
