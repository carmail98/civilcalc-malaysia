"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { manningDrainSizing } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";

const data = formulaData.drain_sizing;

export default function DrainSizingPage() {
  const [shape, setShape] = useState<"rectangular" | "trapezoidal">(
    "rectangular"
  );
  const [n, setN] = useState("");
  const [b, setB] = useState("");
  const [y, setY] = useState("");
  const [S, setS] = useState("");
  const [z, setZ] = useState("");

  const nVal = parseFloat(n);
  const bVal = parseFloat(b);
  const yVal = parseFloat(y);
  const sVal = parseFloat(S);
  const zVal = parseFloat(z);

  const { savedList, save, remove, clearAll } = useCalcStorage("drain-sizing");

  // Validation
  const nError =
    n !== "" && !isNaN(nVal)
      ? nVal < 0.009
        ? "Manning n must be at least 0.009"
        : nVal > 0.06
        ? "Manning n exceeds typical range (max 0.06)"
        : undefined
      : undefined;

  const bError =
    b !== "" && !isNaN(bVal) && bVal <= 0
      ? "Base width must be positive"
      : undefined;

  const yError =
    y !== "" && !isNaN(yVal) && yVal <= 0
      ? "Flow depth must be positive"
      : undefined;

  const sError =
    S !== "" && !isNaN(sVal)
      ? sVal < 0.001
        ? "Min slope 0.001 m/m for self-cleansing (MSMA Ch 16)"
        : sVal > 0.1
        ? "Slope exceeds typical range"
        : undefined
      : undefined;

  const zError =
    shape === "trapezoidal" && z !== "" && !isNaN(zVal) && zVal <= 0
      ? "Side slope must be positive"
      : undefined;

  const hasErrors = !!nError || !!bError || !!yError || !!sError || !!zError;

  const allValid =
    !isNaN(nVal) &&
    nVal > 0 &&
    !isNaN(bVal) &&
    bVal > 0 &&
    !isNaN(yVal) &&
    yVal > 0 &&
    !isNaN(sVal) &&
    sVal > 0 &&
    !hasErrors &&
    (shape === "rectangular" || (!isNaN(zVal) && zVal > 0));

  const result = allValid
    ? manningDrainSizing(
        nVal,
        bVal,
        yVal,
        sVal,
        shape,
        shape === "trapezoidal" ? zVal : 0
      )
    : null;

  // Velocity warnings per MSMA
  const velocityWarning =
    result !== null
      ? result.velocity < 0.6
        ? "Velocity below 0.6 m/s — risk of siltation (MSMA Ch 16)"
        : result.velocity > 4.0
        ? "Velocity exceeds 4.0 m/s — erosion risk, consider lining or energy dissipator"
        : result.velocity > 3.0
        ? "Velocity above 3.0 m/s — ensure adequate lining (MSMA Ch 16)"
        : undefined
      : undefined;

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: "Drainage", href: "/calculators/drainage" }, { label: "Drain Sizing" }]} />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { shape, n, b, y, S, z })}
          onLoad={(v) => { setShape((v.shape as "rectangular" | "trapezoidal") ?? "rectangular"); setN(v.n ?? ""); setB(v.b ?? ""); setY(v.y ?? ""); setS(v.S ?? ""); setZ(v.z ?? ""); }}
          onRemove={remove}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />

        {/* Sub-formulas */}
        <div className="grid gap-2 md:grid-cols-2 mb-6">
          <div className="rounded-2xl bg-stone-50 border border-stone-200 p-3">
            <p className="text-sm font-mono text-stone-700">
              {data.sub_formulas.rectangular}
            </p>
            <p className="text-xs text-stone-400 mt-1">
              Rectangular channel
            </p>
          </div>
          <div className="rounded-2xl bg-stone-50 border border-stone-200 p-3">
            <p className="text-sm font-mono text-stone-700">
              {data.sub_formulas.trapezoidal}
            </p>
            <p className="text-xs text-stone-400 mt-1">
              Trapezoidal channel
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            {/* Channel shape selector */}
            <h3 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">
              Channel Shape
            </h3>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setShape("rectangular")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  shape === "rectangular"
                    ? "bg-amber-600 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                Rectangular
              </button>
              <button
                onClick={() => setShape("trapezoidal")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  shape === "trapezoidal"
                    ? "bg-amber-600 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                Trapezoidal
              </button>
            </div>

            {/* Inputs */}
            <h3 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">
              Channel Properties
            </h3>
            <CalcInput
              name="n"
              label={data.variables.n.label}
              unit={data.variables.n.unit}
              hint={data.variables.n.hint}
              value={n}
              onChange={setN}
              min={0.009}
              max={0.06}
              error={nError}
            />
            <CalcInput
              name="b"
              label={data.variables.b.label}
              unit={data.variables.b.unit}
              hint={data.variables.b.hint}
              value={b}
              onChange={setB}
              min={0}
              error={bError}
            />
            <CalcInput
              name="y"
              label={data.variables.y.label}
              unit={data.variables.y.unit}
              hint={data.variables.y.hint}
              value={y}
              onChange={setY}
              min={0}
              error={yError}
            />
            <CalcInput
              name="S"
              label={data.variables.S.label}
              unit={data.variables.S.unit}
              hint={data.variables.S.hint}
              value={S}
              onChange={setS}
              min={0.001}
              max={0.1}
              error={sError}
            />
            {shape === "trapezoidal" && (
              <CalcInput
                name="z"
                label={data.variables.z.label}
                unit={data.variables.z.unit}
                hint={data.variables.z.hint}
                value={z}
                onChange={setZ}
                min={0}
                error={zError}
              />
            )}

            {allValid && result !== null && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: `${data.formula}  |  ${
                    shape === "rectangular"
                      ? data.sub_formulas.rectangular
                      : data.sub_formulas.trapezoidal
                  }`,
                  inputs: [
                    { label: "Channel Shape", value: shape === "rectangular" ? "Rectangular" : "Trapezoidal", unit: "—" },
                    { label: data.variables.n.label, value: n, unit: "—" },
                    { label: data.variables.b.label, value: b, unit: data.variables.b.unit },
                    { label: data.variables.y.label, value: y, unit: data.variables.y.unit },
                    { label: data.variables.S.label, value: S, unit: data.variables.S.unit },
                    ...(shape === "trapezoidal"
                      ? [{ label: data.variables.z.label, value: z, unit: "—" }]
                      : []),
                    { label: "Flow Area (A)", value: result.area.toFixed(4), unit: "m²" },
                    { label: "Wetted Perimeter (P)", value: result.wettedPerimeter.toFixed(4), unit: "m" },
                    { label: "Hydraulic Radius (R)", value: result.hydraulicRadius.toFixed(4), unit: "m" },
                    { label: data.result.V.label, value: result.velocity.toFixed(4), unit: data.result.V.unit },
                  ],
                  result: {
                    label: data.result.Q.label,
                    value: result.discharge.toFixed(4),
                    unit: data.result.Q.unit,
                  },
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            <CalcResult
              label="Flow Area (A)"
              value={result?.area ?? null}
              unit="m²"
            />
            <CalcResult
              label="Wetted Perimeter (P)"
              value={result?.wettedPerimeter ?? null}
              unit="m"
            />
            <CalcResult
              label="Hydraulic Radius (R)"
              value={result?.hydraulicRadius ?? null}
              unit="m"
            />
            <CalcResult
              label={data.result.V.label}
              value={result?.velocity ?? null}
              unit={data.result.V.unit}
            />
            <CalcResult
              label={data.result.Q.label}
              value={result?.discharge ?? null}
              unit={data.result.Q.unit}
            />

            {velocityWarning && (
              <div
                className={`rounded-2xl border p-3 text-sm ${
                  result && result.velocity > 4.0
                    ? "border-red-200 bg-red-50 text-red-800"
                    : "border-amber-200 bg-amber-50 text-amber-800"
                }`}
              >
                {velocityWarning}
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
          formula={`${data.formula}  |  ${
            shape === "rectangular"
              ? data.sub_formulas.rectangular
              : data.sub_formulas.trapezoidal
          }`}
          inputs={[
            { label: "Channel Shape", value: shape === "rectangular" ? "Rectangular" : "Trapezoidal", unit: "—" },
            { label: data.variables.n.label, value: n, unit: "—" },
            { label: data.variables.b.label, value: b, unit: data.variables.b.unit },
            { label: data.variables.y.label, value: y, unit: data.variables.y.unit },
            { label: data.variables.S.label, value: S, unit: data.variables.S.unit },
            ...(shape === "trapezoidal"
              ? [{ label: data.variables.z.label, value: z, unit: "—" }]
              : []),
            { label: "Flow Area (A)", value: result.area.toFixed(4), unit: "m²" },
            { label: "Wetted Perimeter (P)", value: result.wettedPerimeter.toFixed(4), unit: "m" },
            { label: "Hydraulic Radius (R)", value: result.hydraulicRadius.toFixed(4), unit: "m" },
            { label: data.result.V.label, value: result.velocity.toFixed(4), unit: data.result.V.unit },
          ]}
          result={{
            label: data.result.Q.label,
            value: result.discharge.toFixed(4),
            unit: data.result.Q.unit,
          }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
