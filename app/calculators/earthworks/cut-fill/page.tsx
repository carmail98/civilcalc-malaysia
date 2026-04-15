"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { cutFillVolume } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";

const data = formulaData.cut_fill_volume;

export default function CutFillPage() {
  const [A1, setA1] = useState("");
  const [A2, setA2] = useState("");
  const [L, setL] = useState("");
  const [method, setMethod] = useState<"average" | "prismoidal">("average");
  const [type, setType] = useState<"Cut" | "Fill">("Cut");

  const a1Val = parseFloat(A1);
  const a2Val = parseFloat(A2);
  const lVal = parseFloat(L);

  const { savedList, save, remove, clearAll, exportCalcs, importCalcs, isLoggedIn, syncing } = useCalcStorage("cut-fill-volume");

  // Validation
  const a1Error =
    A1 !== "" && !isNaN(a1Val) && a1Val < 0
      ? "Area cannot be negative"
      : undefined;
  const a2Error =
    A2 !== "" && !isNaN(a2Val) && a2Val < 0
      ? "Area cannot be negative"
      : undefined;
  const lError =
    L !== "" && !isNaN(lVal) && lVal < 0.1
      ? "Distance must be at least 0.1 m"
      : undefined;

  // Warning for large cross-section variation
  const variationWarning =
    A1 !== "" &&
    A2 !== "" &&
    !isNaN(a1Val) &&
    !isNaN(a2Val) &&
    a1Val > 0 &&
    Math.abs(a1Val - a2Val) > a1Val * 0.5
      ? "Large cross-section variation — Prismoidal method recommended"
      : undefined;

  const hasErrors = !!a1Error || !!a2Error || !!lError;
  const allValid =
    !isNaN(a1Val) &&
    !isNaN(a2Val) &&
    !isNaN(lVal) &&
    a1Val >= 0 &&
    a2Val >= 0 &&
    lVal >= 0.1 &&
    !hasErrors;

  const result = allValid ? cutFillVolume(a1Val, a2Val, lVal, method) : null;

  const formulaDisplay =
    method === "prismoidal" ? data.formula_prismoidal : data.formula;

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: "Earthworks", href: "/calculators/earthworks" }, { label: "Cut & Fill Volume" }]} />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { A1, A2, L, method, type })}
          onLoad={(v) => { setA1(v.A1 ?? ""); setA2(v.A2 ?? ""); setL(v.L ?? ""); setMethod((v.method as "average" | "prismoidal") ?? "average"); setType((v.type as "Cut" | "Fill") ?? "Cut"); }}
          onRemove={remove}
          onExport={exportCalcs}
          onImport={importCalcs}
          isLoggedIn={isLoggedIn}
          syncing={syncing}
          onClearAll={clearAll}
        />

        <FormulaBox formula={formulaDisplay} reference={data.reference} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            {/* Method selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Calculation Method
              </label>
              <select
                value={method}
                onChange={(e) =>
                  setMethod(e.target.value as "average" | "prismoidal")
                }
                className="w-full rounded-2xl border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:border-amber-500 focus:ring-amber-500"
              >
                <option value="average">Average End Area</option>
                <option value="prismoidal">Prismoidal</option>
              </select>
            </div>

            {/* Type selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Earthworks Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "Cut" | "Fill")}
                className="w-full rounded-2xl border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:border-amber-500 focus:ring-amber-500"
              >
                <option value="Cut">Cut</option>
                <option value="Fill">Fill</option>
              </select>
            </div>

            <CalcInput
              name="A1"
              label={data.variables.A1.label}
              unit={data.variables.A1.unit}
              hint={data.variables.A1.hint}
              value={A1}
              onChange={setA1}
              min={0}
              error={a1Error}
            />
            <CalcInput
              name="A2"
              label={data.variables.A2.label}
              unit={data.variables.A2.unit}
              hint={data.variables.A2.hint}
              value={A2}
              onChange={setA2}
              min={0}
              error={a2Error}
            />
            <CalcInput
              name="L"
              label={data.variables.L.label}
              unit={data.variables.L.unit}
              hint={data.variables.L.hint}
              value={L}
              onChange={setL}
              min={0.1}
              error={lError}
            />

            {variationWarning && (
              <p className="mt-1 text-xs text-amber-600">{variationWarning}</p>
            )}

            {allValid && result !== null && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: formulaDisplay,
                  inputs: [
                    { label: "Method", value: method === "prismoidal" ? "Prismoidal" : "Average End Area", unit: "—" },
                    { label: "Type", value: type, unit: "—" },
                    { label: data.variables.A1.label, value: A1, unit: data.variables.A1.unit },
                    { label: data.variables.A2.label, value: A2, unit: data.variables.A2.unit },
                    { label: data.variables.L.label, value: L, unit: data.variables.L.unit },
                  ],
                  result: {
                    label: `${type} ${data.result.V.label}`,
                    value: result.toFixed(4),
                    unit: data.result.V.unit,
                  },
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div>
            <CalcResult
              label={`${type} ${data.result.V.label}`}
              value={result}
              unit={data.result.V.unit}
            />
            {result !== null && (
              <p className="mt-2 text-sm text-stone-500">
                Method: {method === "prismoidal" ? "Prismoidal" : "Average End Area"} | Type: {type}
              </p>
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
          formula={formulaDisplay}
          inputs={[
            { label: "Method", value: method === "prismoidal" ? "Prismoidal" : "Average End Area", unit: "—" },
            { label: "Type", value: type, unit: "—" },
            { label: data.variables.A1.label, value: A1, unit: data.variables.A1.unit },
            { label: data.variables.A2.label, value: A2, unit: data.variables.A2.unit },
            { label: data.variables.L.label, value: L, unit: data.variables.L.unit },
          ]}
          result={{
            label: `${type} ${data.result.V.label}`,
            value: result.toFixed(4),
            unit: data.result.V.unit,
          }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
