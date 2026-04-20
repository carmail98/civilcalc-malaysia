"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { sightDistance } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import KeyTerms from "@/components/KeyTerms";
import { keyTerms } from "@/data/key-terms";

const data = (formulaData as Record<string, any>).sight_distance;

export default function SightDistancePage() {
  const [designSpeed, setDesignSpeed] = useState("");
  const [reactionTime, setReactionTime] = useState("2.5");
  const [friction, setFriction] = useState("0.35");
  const [gradient, setGradient] = useState("");
  const [objectHeight, setObjectHeight] = useState("150");
  const [eyeHeight, setEyeHeight] = useState("1050");

  const designSpeedVal = parseFloat(designSpeed);
  const reactionTimeVal = parseFloat(reactionTime);
  const frictionVal = parseFloat(friction);
  const gradientVal = parseFloat(gradient);
  const objectHeightVal = parseFloat(objectHeight);
  const eyeHeightVal = parseFloat(eyeHeight);

  const { savedList, save, remove, clearAll, exportCalcs, importCalcs, isLoggedIn, syncing } =
    useCalcStorage("sight-distance");

  const allValid =
    !isNaN(designSpeedVal) &&
    designSpeedVal > 0 &&
    !isNaN(reactionTimeVal) &&
    reactionTimeVal > 0 &&
    !isNaN(frictionVal) &&
    frictionVal > 0 &&
    !isNaN(gradientVal) &&
    !isNaN(objectHeightVal) &&
    objectHeightVal > 0 &&
    !isNaN(eyeHeightVal) &&
    eyeHeightVal > 0;

  const result = allValid
    ? sightDistance(designSpeedVal, reactionTimeVal, frictionVal, gradientVal, objectHeightVal, eyeHeightVal)
    : null;

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <Breadcrumbs
          items={[
            { label: "Roads", href: "/calculators/roads" },
            { label: "Sight Distance" },
          ]}
        />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) =>
            save(name, { designSpeed, reactionTime, friction, gradient, objectHeight, eyeHeight })
          }
          onLoad={(v) => {
            setDesignSpeed(v.designSpeed ?? "");
            setReactionTime(v.reactionTime ?? "2.5");
            setFriction(v.friction ?? "0.35");
            setGradient(v.gradient ?? "");
            setObjectHeight(v.objectHeight ?? "150");
            setEyeHeight(v.eyeHeight ?? "1050");
          }}
          onRemove={remove}
          onExport={exportCalcs}
          onImport={importCalcs}
          onReset={() => { setDesignSpeed(""); setReactionTime("2.5"); setFriction("0.35"); setGradient(""); setObjectHeight("150"); setEyeHeight("1050"); }}
          isLoggedIn={isLoggedIn}
          syncing={syncing}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />

        <KeyTerms
          terms={keyTerms["sight-distance"].terms}
          standard={keyTerms["sight-distance"].standard}
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
              name="reactionTime"
              label={data.variables.reactionTime.label}
              unit={data.variables.reactionTime.unit}
              hint={data.variables.reactionTime.hint}
              value={reactionTime}
              onChange={setReactionTime}
              min={0}
            />
            <CalcInput
              name="friction"
              label={data.variables.friction.label}
              unit={data.variables.friction.unit}
              hint={data.variables.friction.hint}
              value={friction}
              onChange={setFriction}
              min={0}
            />
            <CalcInput
              name="gradient"
              label={data.variables.gradient.label}
              unit={data.variables.gradient.unit}
              hint={data.variables.gradient.hint}
              value={gradient}
              onChange={setGradient}
            />
            <CalcInput
              name="objectHeight"
              label={data.variables.objectHeight.label}
              unit={data.variables.objectHeight.unit}
              hint={data.variables.objectHeight.hint}
              value={objectHeight}
              onChange={setObjectHeight}
              min={0}
            />
            <CalcInput
              name="eyeHeight"
              label={data.variables.eyeHeight.label}
              unit={data.variables.eyeHeight.unit}
              hint={data.variables.eyeHeight.hint}
              value={eyeHeight}
              onChange={setEyeHeight}
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
                    { label: data.variables.reactionTime.label, value: reactionTime, unit: data.variables.reactionTime.unit },
                    { label: data.variables.friction.label, value: friction, unit: data.variables.friction.unit || "—" },
                    { label: data.variables.gradient.label, value: gradient, unit: data.variables.gradient.unit },
                    { label: data.variables.objectHeight.label, value: objectHeight, unit: data.variables.objectHeight.unit },
                    { label: data.variables.eyeHeight.label, value: eyeHeight, unit: data.variables.eyeHeight.unit },
                  ],
                  result: {
                    label: "Stopping Sight Distance (SSD)",
                    value: result.SSD.toFixed(2),
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
                  label="Reaction Distance"
                  value={result.reactionDistance}
                  unit="m"
                  decimals={2}
                />
                <CalcResult
                  label="Braking Distance"
                  value={result.brakingDistance}
                  unit="m"
                  decimals={2}
                />
                <CalcResult
                  label="Stopping Sight Distance (SSD)"
                  value={result.SSD}
                  unit="m"
                  decimals={2}
                />
                <CalcResult
                  label="Overtaking Sight Distance (OSD)"
                  value={result.OSD}
                  unit="m"
                  decimals={2}
                />
                <CalcResult
                  label="Vertical Curve K Value"
                  value={result.verticalCurveK}
                  unit=""
                  decimals={2}
                />
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
            { label: data.variables.reactionTime.label, value: reactionTime, unit: data.variables.reactionTime.unit },
            { label: data.variables.friction.label, value: friction, unit: data.variables.friction.unit || "—" },
            { label: data.variables.gradient.label, value: gradient, unit: data.variables.gradient.unit },
            { label: data.variables.objectHeight.label, value: objectHeight, unit: data.variables.objectHeight.unit },
            { label: data.variables.eyeHeight.label, value: eyeHeight, unit: data.variables.eyeHeight.unit },
            { label: "Reaction Distance", value: result.reactionDistance.toFixed(2), unit: "m" },
            { label: "Braking Distance", value: result.brakingDistance.toFixed(2), unit: "m" },
            { label: "OSD", value: result.OSD.toFixed(2), unit: "m" },
            { label: "K Value", value: result.verticalCurveK.toFixed(2), unit: "" },
          ]}
          result={{
            label: "Stopping Sight Distance (SSD)",
            value: result.SSD.toFixed(2),
            unit: "m",
          }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
