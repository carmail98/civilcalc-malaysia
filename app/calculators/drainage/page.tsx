"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { rationalMethod } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";

const data = formulaData.rational_method;

export default function DrainagePage() {
  const [C, setC] = useState("");
  const [i, setI] = useState("");
  const [A, setA] = useState("");

  const cVal = parseFloat(C);
  const iVal = parseFloat(i);
  const aVal = parseFloat(A);

  const { savedList, save, remove, clearAll } = useCalcStorage("rational-method");

  // Validation
  const cError = C !== "" && !isNaN(cVal)
    ? cVal < 0 ? "Value cannot be negative"
    : cVal > 1 ? "Runoff coefficient must be between 0 and 1 (per MSMA)"
    : undefined
    : undefined;

  const iError = i !== "" && !isNaN(iVal) && iVal < 0
    ? "Value cannot be negative" : undefined;

  const aError = A !== "" && !isNaN(aVal) && aVal < 0
    ? "Value cannot be negative" : undefined;

  const aWarning = A !== "" && !isNaN(aVal) && aVal > 80
    ? "Rational Method is typically valid for A ≤ 80 ha (MSMA)" : undefined;

  const hasErrors = !!cError || !!iError || !!aError;
  const allValid = !isNaN(cVal) && !isNaN(iVal) && !isNaN(aVal) && !hasErrors;
  const result = allValid ? rationalMethod(cVal, iVal, aVal) : null;

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: "Drainage", href: "/calculators/drainage" }, { label: "Rational Method" }]} />
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{data.name}</h1>
        <p className="text-sm text-gray-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { C, i, A })}
          onLoad={(v) => { setC(v.C ?? ""); setI(v.i ?? ""); setA(v.A ?? ""); }}
          onRemove={remove}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <CalcInput
              name="C"
              label={data.variables.C.label}
              unit={data.variables.C.unit}
              hint={data.variables.C.hint}
              value={C}
              onChange={setC}
              min={0}
              max={1}
              error={cError}
            />
            <CalcInput
              name="i"
              label={data.variables.i.label}
              unit={data.variables.i.unit}
              hint={data.variables.i.hint}
              value={i}
              onChange={setI}
              min={0}
              error={iError}
            />
            <CalcInput
              name="A"
              label={data.variables.A.label}
              unit={data.variables.A.unit}
              hint={data.variables.A.hint}
              value={A}
              onChange={setA}
              min={0}
              error={aError}
              warning={aWarning}
            />

            {allValid && result !== null && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: data.formula,
                  inputs: [
                    { label: data.variables.C.label, value: C, unit: data.variables.C.unit || "—" },
                    { label: data.variables.i.label, value: i, unit: data.variables.i.unit },
                    { label: data.variables.A.label, value: A, unit: data.variables.A.unit },
                  ],
                  result: {
                    label: data.result.Q.label,
                    value: result.toFixed(4),
                    unit: data.result.Q.unit,
                  },
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div>
            <CalcResult
              label={data.result.Q.label}
              value={result}
              unit={data.result.Q.unit}
            />
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
            { label: data.variables.C.label, value: C, unit: data.variables.C.unit || "—" },
            { label: data.variables.i.label, value: i, unit: data.variables.i.unit },
            { label: data.variables.A.label, value: A, unit: data.variables.A.unit },
          ]}
          result={{
            label: data.result.Q.label,
            value: result.toFixed(4),
            unit: data.result.Q.unit,
          }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
