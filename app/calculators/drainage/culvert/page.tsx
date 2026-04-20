"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { culvertDesign } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import KeyTerms from "@/components/KeyTerms";
import { keyTerms } from "@/data/key-terms";

const data = formulaData.culvert_design;

export default function CulvertPage() {
  const [culvertType, setCulvertType] = useState<"box" | "pipe">("box");
  const [n, setN] = useState("0.013");
  const [slope, setSlope] = useState("");
  const [numBarrels, setNumBarrels] = useState("1");
  const [boxB, setBoxB] = useState("");
  const [boxD, setBoxD] = useState("");
  const [pipeD, setPipeD] = useState("");
  const [Qdesign, setQdesign] = useState("");

  const nVal = parseFloat(n);
  const slopeVal = parseFloat(slope);
  const barrelsVal = parseInt(numBarrels);
  const boxBVal = parseFloat(boxB);
  const boxDVal = parseFloat(boxD);
  const pipeDVal = parseFloat(pipeD);
  const QdVal = parseFloat(Qdesign);

  const { savedList, save, remove, clearAll, exportCalcs, importCalcs, isLoggedIn, syncing } = useCalcStorage("culvert-design");

  // Validation
  const nError =
    n !== "" && !isNaN(nVal)
      ? nVal < 0.009
        ? "Manning n must be at least 0.009"
        : nVal > 0.035
        ? "Manning n exceeds typical culvert range"
        : undefined
      : undefined;

  const slopeError =
    slope !== "" && !isNaN(slopeVal)
      ? slopeVal <= 0
        ? "Slope must be positive"
        : slopeVal > 0.1
        ? "Slope exceeds typical range"
        : undefined
      : undefined;

  const barrelsError =
    numBarrels !== "" && !isNaN(barrelsVal)
      ? barrelsVal < 1
        ? "At least 1 barrel required"
        : barrelsVal > 6
        ? "Exceeds typical maximum (6 barrels)"
        : undefined
      : undefined;

  const boxBError =
    culvertType === "box" && boxB !== "" && !isNaN(boxBVal) && boxBVal <= 0
      ? "Width must be positive"
      : undefined;

  const boxDError =
    culvertType === "box" && boxD !== "" && !isNaN(boxDVal) && boxDVal <= 0
      ? "Height must be positive"
      : undefined;

  const pipeDError =
    culvertType === "pipe" && pipeD !== "" && !isNaN(pipeDVal) && pipeDVal <= 0
      ? "Diameter must be positive"
      : undefined;

  const QdError =
    Qdesign !== "" && !isNaN(QdVal) && QdVal < 0
      ? "Design flow cannot be negative"
      : undefined;

  const hasErrors =
    !!nError ||
    !!slopeError ||
    !!barrelsError ||
    !!boxBError ||
    !!boxDError ||
    !!pipeDError ||
    !!QdError;

  const dimensionsValid =
    culvertType === "box"
      ? !isNaN(boxBVal) && boxBVal > 0 && !isNaN(boxDVal) && boxDVal > 0
      : !isNaN(pipeDVal) && pipeDVal > 0;

  const allValid =
    !isNaN(nVal) &&
    nVal > 0 &&
    !isNaN(slopeVal) &&
    slopeVal > 0 &&
    !isNaN(barrelsVal) &&
    barrelsVal >= 1 &&
    dimensionsValid &&
    !hasErrors;

  const result = allValid
    ? culvertDesign(
        nVal,
        slopeVal,
        barrelsVal,
        culvertType,
        culvertType === "box" ? boxBVal : pipeDVal,
        culvertType === "box" ? boxDVal : 0,
        Qdesign !== "" && !isNaN(QdVal) && QdVal > 0 ? QdVal : undefined
      )
    : null;

  // Velocity warnings
  const velocityWarning =
    result !== null
      ? result.velocity < 0.6
        ? "Velocity below 0.6 m/s — risk of siltation"
        : result.velocity > 6.0
        ? "Velocity exceeds 6.0 m/s — risk of scour, consider energy dissipator"
        : result.velocity > 4.0
        ? "High velocity — ensure adequate outlet protection"
        : undefined
      : undefined;

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: "Drainage", href: "/calculators/drainage" }, { label: "Culvert Design" }]} />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { culvertType, n, slope, numBarrels, boxB, boxD, pipeD, Qdesign })}
          onLoad={(v) => { setCulvertType((v.culvertType as "box" | "pipe") ?? "box"); setN(v.n ?? "0.013"); setSlope(v.slope ?? ""); setNumBarrels(v.numBarrels ?? "1"); setBoxB(v.boxB ?? ""); setBoxD(v.boxD ?? ""); setPipeD(v.pipeD ?? ""); setQdesign(v.Qdesign ?? ""); }}
          onRemove={remove}
          onExport={exportCalcs}
          onImport={importCalcs}
          onReset={() => { setCulvertType("box"); setN("0.013"); setSlope(""); setNumBarrels("1"); setBoxB(""); setBoxD(""); setPipeD(""); setQdesign(""); }}
          isLoggedIn={isLoggedIn}
          syncing={syncing}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />

        {/* Sub-formulas */}
        <div className="grid gap-2 md:grid-cols-2 mb-6">
          <div className="rounded-2xl bg-stone-50 border border-stone-200 p-3">
            <p className="text-sm font-mono text-stone-700">
              {data.sub_formulas.box}
            </p>
            <p className="text-xs text-stone-400 mt-1">Box culvert (RCBC)</p>
          </div>
          <div className="rounded-2xl bg-stone-50 border border-stone-200 p-3">
            <p className="text-sm font-mono text-stone-700">
              {data.sub_formulas.pipe}
            </p>
            <p className="text-xs text-stone-400 mt-1">Pipe culvert (RCP)</p>
          </div>
        </div>

        <KeyTerms terms={keyTerms["culvert-design"].terms} standard={keyTerms["culvert-design"].standard} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            {/* Culvert type selector */}
            <h3 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">
              Culvert Type
            </h3>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setCulvertType("box")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  culvertType === "box"
                    ? "bg-amber-600 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                Box (RCBC)
              </button>
              <button
                onClick={() => setCulvertType("pipe")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  culvertType === "pipe"
                    ? "bg-amber-600 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                Pipe (RCP)
              </button>
            </div>

            {/* Common inputs */}
            <h3 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">
              Culvert Properties
            </h3>
            <CalcInput
              name="n"
              label={data.variables.n.label}
              unit={data.variables.n.unit}
              hint={data.variables.n.hint}
              value={n}
              onChange={setN}
              min={0.009}
              max={0.035}
              error={nError}
            />
            <CalcInput
              name="slope"
              label={data.variables.slope.label}
              unit={data.variables.slope.unit}
              hint={data.variables.slope.hint}
              value={slope}
              onChange={setSlope}
              min={0}
              error={slopeError}
            />
            <CalcInput
              name="numBarrels"
              label={data.variables.numBarrels.label}
              unit={data.variables.numBarrels.unit}
              hint={data.variables.numBarrels.hint}
              value={numBarrels}
              onChange={setNumBarrels}
              min={1}
              max={6}
              error={barrelsError}
            />

            {/* Dimension inputs */}
            <h3 className="text-sm font-semibold text-stone-600 mb-2 mt-6 uppercase tracking-wide">
              Dimensions
            </h3>
            {culvertType === "box" ? (
              <>
                <CalcInput
                  name="boxB"
                  label={data.variables.B.label}
                  unit={data.variables.B.unit}
                  hint={data.variables.B.hint}
                  value={boxB}
                  onChange={setBoxB}
                  min={0}
                  error={boxBError}
                />
                <CalcInput
                  name="boxD"
                  label={data.variables.D.label}
                  unit={data.variables.D.unit}
                  hint={data.variables.D.hint}
                  value={boxD}
                  onChange={setBoxD}
                  min={0}
                  error={boxDError}
                />
              </>
            ) : (
              <CalcInput
                name="pipeD"
                label={data.variables.d.label}
                unit={data.variables.d.unit}
                hint={data.variables.d.hint}
                value={pipeD}
                onChange={setPipeD}
                min={0}
                error={pipeDError}
              />
            )}

            {/* Optional design flow */}
            <h3 className="text-sm font-semibold text-stone-600 mb-2 mt-6 uppercase tracking-wide">
              Adequacy Check (Optional)
            </h3>
            <CalcInput
              name="Qdesign"
              label={data.variables.Qdesign.label}
              unit={data.variables.Qdesign.unit}
              hint={data.variables.Qdesign.hint}
              value={Qdesign}
              onChange={setQdesign}
              min={0}
              error={QdError}
            />

            {allValid && result !== null && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: `${data.formula}  |  ${
                    culvertType === "box"
                      ? data.sub_formulas.box
                      : data.sub_formulas.pipe
                  }`,
                  inputs: [
                    { label: "Culvert Type", value: culvertType === "box" ? "Box (RCBC)" : "Pipe (RCP)", unit: "—" },
                    { label: data.variables.n.label, value: n, unit: "—" },
                    { label: data.variables.slope.label, value: slope, unit: data.variables.slope.unit },
                    { label: data.variables.numBarrels.label, value: numBarrels, unit: "—" },
                    ...(culvertType === "box"
                      ? [
                          { label: data.variables.B.label, value: boxB, unit: data.variables.B.unit },
                          { label: data.variables.D.label, value: boxD, unit: data.variables.D.unit },
                        ]
                      : [
                          { label: data.variables.d.label, value: pipeD, unit: data.variables.d.unit },
                        ]),
                    { label: "Flow Area per Barrel", value: result.area.toFixed(4), unit: "m²" },
                    { label: "Wetted Perimeter", value: result.wettedPerimeter.toFixed(4), unit: "m" },
                    { label: "Hydraulic Radius", value: result.hydraulicRadius.toFixed(4), unit: "m" },
                    { label: data.result.V.label, value: result.velocity.toFixed(4), unit: data.result.V.unit },
                    { label: "Capacity per Barrel", value: result.capacityPerBarrel.toFixed(4), unit: "m³/s" },
                    ...(Qdesign !== "" && !isNaN(QdVal) && QdVal > 0
                      ? [
                          { label: "Design Flow (Q_design)", value: Qdesign, unit: "m³/s" },
                          { label: "Adequacy Ratio", value: result.adequacy!.toFixed(2), unit: result.pass ? "ADEQUATE" : "INADEQUATE" },
                        ]
                      : []),
                  ],
                  result: {
                    label: data.result.Q.label,
                    value: result.totalCapacity.toFixed(4),
                    unit: data.result.Q.unit,
                  },
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            <CalcResult
              label="Flow Area per Barrel (A)"
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
              label="Capacity per Barrel"
              value={result?.capacityPerBarrel ?? null}
              unit="m³/s"
            />
            {barrelsVal > 1 && (
              <CalcResult
                label={`${data.result.Q.label} (${barrelsVal} barrels)`}
                value={result?.totalCapacity ?? null}
                unit={data.result.Q.unit}
              />
            )}
            {barrelsVal <= 1 && (
              <CalcResult
                label={data.result.Q.label}
                value={result?.totalCapacity ?? null}
                unit={data.result.Q.unit}
              />
            )}

            {/* Adequacy check */}
            {result !== null && result.adequacy !== null && (
              <div
                className={`rounded-2xl border p-4 ${
                  result.pass
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    result.pass ? "text-green-900" : "text-red-900"
                  }`}
                >
                  Adequacy Ratio: {result.adequacy.toFixed(2)}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    result.pass ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {result.pass
                    ? "Q_capacity >= Q_design — ADEQUATE"
                    : "Q_capacity < Q_design — INADEQUATE, increase size or add barrels"}
                </p>
              </div>
            )}

            {/* Velocity warning */}
            {velocityWarning && (
              <div
                className={`rounded-2xl border p-3 text-sm ${
                  result && result.velocity > 6.0
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
            culvertType === "box"
              ? data.sub_formulas.box
              : data.sub_formulas.pipe
          }`}
          inputs={[
            {
              label: "Culvert Type",
              value: culvertType === "box" ? "Box (RCBC)" : "Pipe (RCP)",
              unit: "—",
            },
            { label: data.variables.n.label, value: n, unit: "—" },
            {
              label: data.variables.slope.label,
              value: slope,
              unit: data.variables.slope.unit,
            },
            {
              label: data.variables.numBarrels.label,
              value: numBarrels,
              unit: "—",
            },
            ...(culvertType === "box"
              ? [
                  {
                    label: data.variables.B.label,
                    value: boxB,
                    unit: data.variables.B.unit,
                  },
                  {
                    label: data.variables.D.label,
                    value: boxD,
                    unit: data.variables.D.unit,
                  },
                ]
              : [
                  {
                    label: data.variables.d.label,
                    value: pipeD,
                    unit: data.variables.d.unit,
                  },
                ]),
            {
              label: "Flow Area per Barrel",
              value: result.area.toFixed(4),
              unit: "m²",
            },
            {
              label: "Wetted Perimeter",
              value: result.wettedPerimeter.toFixed(4),
              unit: "m",
            },
            {
              label: "Hydraulic Radius",
              value: result.hydraulicRadius.toFixed(4),
              unit: "m",
            },
            {
              label: data.result.V.label,
              value: result.velocity.toFixed(4),
              unit: data.result.V.unit,
            },
            {
              label: "Capacity per Barrel",
              value: result.capacityPerBarrel.toFixed(4),
              unit: "m³/s",
            },
            ...(Qdesign !== "" && !isNaN(QdVal) && QdVal > 0
              ? [
                  {
                    label: "Design Flow (Q_design)",
                    value: Qdesign,
                    unit: "m³/s",
                  },
                  {
                    label: "Adequacy Ratio",
                    value: result.adequacy!.toFixed(2),
                    unit: result.pass ? "ADEQUATE" : "INADEQUATE",
                  },
                ]
              : []),
          ]}
          result={{
            label: data.result.Q.label,
            value: result.totalCapacity.toFixed(4),
            unit: data.result.Q.unit,
          }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
