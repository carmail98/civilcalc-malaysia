"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { roadGradientCurve } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import KeyTerms from "@/components/KeyTerms";
import { keyTerms } from "@/data/key-terms";

const data = (formulaData as Record<string, any>).road_gradient_curve;

export default function GradientCurvePage() {
  const [designSpeed, setDesignSpeed] = useState("");
  const [superelevation, setSuperelevation] = useState("");
  const [sideFriction, setSideFriction] = useState("0.15");
  const [grade1, setGrade1] = useState("");
  const [grade2, setGrade2] = useState("");
  const [SSD, setSSD] = useState("");

  const designSpeedVal = parseFloat(designSpeed);
  const superelevationVal = parseFloat(superelevation);
  const sideFrictionVal = parseFloat(sideFriction);
  const grade1Val = parseFloat(grade1);
  const grade2Val = parseFloat(grade2);
  const SSDVal = parseFloat(SSD);

  const { savedList, save, remove, clearAll, exportCalcs, importCalcs, isLoggedIn, syncing } =
    useCalcStorage("road-gradient-curve");

  const allValid =
    !isNaN(designSpeedVal) &&
    designSpeedVal > 0 &&
    !isNaN(superelevationVal) &&
    superelevationVal >= 0 &&
    !isNaN(sideFrictionVal) &&
    sideFrictionVal > 0 &&
    !isNaN(grade1Val) &&
    !isNaN(grade2Val) &&
    !isNaN(SSDVal) &&
    SSDVal > 0;

  const result = allValid
    ? roadGradientCurve(designSpeedVal, superelevationVal, sideFrictionVal, grade1Val, grade2Val, SSDVal)
    : null;

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <Breadcrumbs
          items={[
            { label: "Roads", href: "/calculators/roads" },
            { label: "Gradient & Curve Design" },
          ]}
        />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) =>
            save(name, { designSpeed, superelevation, sideFriction, grade1, grade2, SSD })
          }
          onLoad={(v) => {
            setDesignSpeed(v.designSpeed ?? "");
            setSuperelevation(v.superelevation ?? "");
            setSideFriction(v.sideFriction ?? "0.15");
            setGrade1(v.grade1 ?? "");
            setGrade2(v.grade2 ?? "");
            setSSD(v.SSD ?? "");
          }}
          onRemove={remove}
          onExport={exportCalcs}
          onImport={importCalcs}
          onReset={() => { setDesignSpeed(""); setSuperelevation(""); setSideFriction("0.15"); setGrade1(""); setGrade2(""); setSSD(""); }}
          isLoggedIn={isLoggedIn}
          syncing={syncing}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />

        <KeyTerms
          terms={keyTerms["road-gradient-curve"].terms}
          standard={keyTerms["road-gradient-curve"].standard}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <CalcInput
              name="designSpeed"
              label={data.variables.designSpeed.label}
              unit={data.variables.designSpeed.unit}
              hint={data.variables.designSpeed.hint}
              value={designSpeed}
              onChange={setDesignSpeed}
              min={0}
            />
            <CalcInput
              name="superelevation"
              label={data.variables.superelevation.label}
              unit={data.variables.superelevation.unit}
              hint={data.variables.superelevation.hint}
              value={superelevation}
              onChange={setSuperelevation}
              min={0}
            />
            <CalcInput
              name="sideFriction"
              label={data.variables.sideFriction.label}
              unit={data.variables.sideFriction.unit}
              hint={data.variables.sideFriction.hint}
              value={sideFriction}
              onChange={setSideFriction}
              min={0}
            />
            <CalcInput
              name="grade1"
              label={data.variables.grade1.label}
              unit={data.variables.grade1.unit}
              hint={data.variables.grade1.hint}
              value={grade1}
              onChange={setGrade1}
            />
            <CalcInput
              name="grade2"
              label={data.variables.grade2.label}
              unit={data.variables.grade2.unit}
              hint={data.variables.grade2.hint}
              value={grade2}
              onChange={setGrade2}
            />
            <CalcInput
              name="SSD"
              label={data.variables.SSD.label}
              unit={data.variables.SSD.unit}
              hint={data.variables.SSD.hint}
              value={SSD}
              onChange={setSSD}
              min={0}
            />

            {allValid && result !== null && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: data.formula,
                  inputs: [
                    { label: data.variables.designSpeed.label, value: designSpeed, unit: data.variables.designSpeed.unit },
                    { label: data.variables.superelevation.label, value: superelevation, unit: data.variables.superelevation.unit },
                    { label: data.variables.sideFriction.label, value: sideFriction, unit: data.variables.sideFriction.unit || "—" },
                    { label: data.variables.grade1.label, value: grade1, unit: data.variables.grade1.unit },
                    { label: data.variables.grade2.label, value: grade2, unit: data.variables.grade2.unit },
                    { label: data.variables.SSD.label, value: SSD, unit: data.variables.SSD.unit },
                  ],
                  result: {
                    label: "Minimum Horizontal Radius (Rmin)",
                    value: result.Rmin.toFixed(2),
                    unit: "m",
                  },
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            {result !== null && (
              <>
                <CalcResult
                  label="Minimum Horizontal Radius (Rmin)"
                  value={result.Rmin}
                  unit="m"
                  decimals={2}
                />
                <CalcResult
                  label="Algebraic Grade Difference (A)"
                  value={result.A}
                  unit="%"
                  decimals={2}
                />
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-medium text-amber-700">Curve Type</p>
                  <p className="mt-1 text-2xl font-bold text-amber-900">{result.curveType}</p>
                </div>
                <CalcResult
                  label="K Value (Crest)"
                  value={result.Kcrest}
                  unit=""
                  decimals={2}
                />
                <CalcResult
                  label="K Value (Sag)"
                  value={result.Ksag}
                  unit=""
                  decimals={2}
                />
                <CalcResult
                  label="Min. Curve Length — Crest (Lcrest)"
                  value={result.Lcrest}
                  unit="m"
                  decimals={2}
                />
                <CalcResult
                  label="Min. Curve Length — Sag (Lsag)"
                  value={result.Lsag}
                  unit="m"
                  decimals={2}
                />
                <CalcResult
                  label="Max Allowable Gradient"
                  value={result.maxGradient}
                  unit="%"
                  decimals={0}
                />

                {/* Gradient pass/fail status box */}
                <div
                  className={`rounded-lg border p-4 ${
                    result.gradientOk
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <p
                    className={`text-sm font-semibold ${
                      result.gradientOk ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {result.gradientOk ? "PASS" : "FAIL"} — Gradient Check
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      result.gradientOk ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {result.gradientOk
                      ? `Both grades are within the ${result.maxGradient}% maximum for ${designSpeedVal} km/h design speed.`
                      : `One or both grades exceed the ${result.maxGradient}% maximum for ${designSpeedVal} km/h design speed.`}
                  </p>
                </div>
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
            { label: data.variables.designSpeed.label, value: designSpeed, unit: data.variables.designSpeed.unit },
            { label: data.variables.superelevation.label, value: superelevation, unit: data.variables.superelevation.unit },
            { label: data.variables.sideFriction.label, value: sideFriction, unit: data.variables.sideFriction.unit || "—" },
            { label: data.variables.grade1.label, value: grade1, unit: data.variables.grade1.unit },
            { label: data.variables.grade2.label, value: grade2, unit: data.variables.grade2.unit },
            { label: data.variables.SSD.label, value: SSD, unit: data.variables.SSD.unit },
            { label: "Algebraic Difference (A)", value: result.A.toFixed(2), unit: "%" },
            { label: "Curve Type", value: result.curveType, unit: "" },
            { label: "K Crest", value: result.Kcrest.toFixed(2), unit: "" },
            { label: "K Sag", value: result.Ksag.toFixed(2), unit: "" },
            { label: "Lcrest", value: result.Lcrest.toFixed(2), unit: "m" },
            { label: "Lsag", value: result.Lsag.toFixed(2), unit: "m" },
            { label: "Max Gradient", value: String(result.maxGradient), unit: "%" },
            { label: "Gradient Check", value: result.gradientOk ? "PASS" : "FAIL", unit: "" },
          ]}
          result={{
            label: "Minimum Horizontal Radius (Rmin)",
            value: result.Rmin.toFixed(2),
            unit: "m",
          }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
