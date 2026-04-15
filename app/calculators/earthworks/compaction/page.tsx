"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { dryDensityCompaction } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import KeyTerms from "@/components/KeyTerms";
import { keyTerms } from "@/data/key-terms";

const data = formulaData.dry_density;

export default function CompactionPage() {
  const [wetMass, setWetMass] = useState("");
  const [mouldMass, setMouldMass] = useState("");
  const [mouldVol, setMouldVol] = useState("944");
  const [moisture, setMoisture] = useState("");
  const [MDD, setMDD] = useState("");
  const [requirement, setRequirement] = useState("95");

  const wmVal = parseFloat(wetMass);
  const mmVal = parseFloat(mouldMass);
  const mvVal = parseFloat(mouldVol);
  const moistVal = parseFloat(moisture);
  const mddVal = parseFloat(MDD);
  const reqVal = parseFloat(requirement);

  const { savedList, save, remove, clearAll, exportCalcs, importCalcs, isLoggedIn, syncing } = useCalcStorage("compaction-check");

  // Validation
  const wmError =
    wetMass !== "" && !isNaN(wmVal) && wmVal <= 0
      ? "Wet mass must be positive"
      : undefined;
  const mmError =
    mouldMass !== "" && !isNaN(mmVal) && mmVal <= 0
      ? "Mould mass must be positive"
      : undefined;
  const massError =
    wetMass !== "" && mouldMass !== "" && !isNaN(wmVal) && !isNaN(mmVal) && wmVal <= mmVal
      ? "Wet mass must be greater than mould mass"
      : undefined;
  const mvError =
    mouldVol !== "" && !isNaN(mvVal) && mvVal <= 0
      ? "Mould volume must be positive"
      : undefined;
  const moistError =
    moisture !== "" && !isNaN(moistVal)
      ? moistVal < 0
        ? "Moisture content cannot be negative"
        : moistVal > 100
        ? "Moisture content cannot exceed 100%"
        : undefined
      : undefined;
  const mddError =
    MDD !== "" && !isNaN(mddVal) && mddVal <= 0
      ? "MDD must be positive"
      : undefined;
  const reqError =
    requirement !== "" && !isNaN(reqVal)
      ? reqVal < 80 || reqVal > 105
        ? "Requirement typically 80–105%"
        : undefined
      : undefined;

  const hasErrors =
    !!wmError || !!mmError || !!massError || !!mvError || !!moistError || !!mddError || !!reqError;
  const allValid =
    !isNaN(wmVal) &&
    !isNaN(mmVal) &&
    !isNaN(mvVal) &&
    !isNaN(moistVal) &&
    !isNaN(mddVal) &&
    !isNaN(reqVal) &&
    wmVal > mmVal &&
    mvVal > 0 &&
    mddVal > 0 &&
    !hasErrors;

  const result = allValid
    ? dryDensityCompaction(wmVal, mmVal, mvVal, moistVal, mddVal, reqVal)
    : null;

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: "Earthworks", href: "/calculators/earthworks" }, { label: "Compaction Check" }]} />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { wetMass, mouldMass, mouldVol, moisture, MDD, requirement })}
          onLoad={(v) => { setWetMass(v.wetMass ?? ""); setMouldMass(v.mouldMass ?? ""); setMouldVol(v.mouldVol ?? "944"); setMoisture(v.moisture ?? ""); setMDD(v.MDD ?? ""); setRequirement(v.requirement ?? "95"); }}
          onRemove={remove}
          onExport={exportCalcs}
          onImport={importCalcs}
          isLoggedIn={isLoggedIn}
          syncing={syncing}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />
        <KeyTerms terms={keyTerms["compaction-check"].terms} standard={keyTerms["compaction-check"].standard} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <CalcInput
              name="wetMass"
              label={data.variables.wetMass.label}
              unit={data.variables.wetMass.unit}
              hint={data.variables.wetMass.hint}
              value={wetMass}
              onChange={setWetMass}
              min={0}
              error={wmError || massError}
            />
            <CalcInput
              name="mouldMass"
              label={data.variables.mouldMass.label}
              unit={data.variables.mouldMass.unit}
              hint={data.variables.mouldMass.hint}
              value={mouldMass}
              onChange={setMouldMass}
              min={0}
              error={mmError}
            />
            <CalcInput
              name="mouldVol"
              label={data.variables.mouldVol.label}
              unit={data.variables.mouldVol.unit}
              hint={data.variables.mouldVol.hint}
              value={mouldVol}
              onChange={setMouldVol}
              min={0}
              error={mvError}
            />
            <CalcInput
              name="moisture"
              label={data.variables.moisture.label}
              unit={data.variables.moisture.unit}
              hint={data.variables.moisture.hint}
              value={moisture}
              onChange={setMoisture}
              min={0}
              max={100}
              error={moistError}
            />
            <CalcInput
              name="MDD"
              label={data.variables.MDD.label}
              unit={data.variables.MDD.unit}
              hint={data.variables.MDD.hint}
              value={MDD}
              onChange={setMDD}
              min={0}
              error={mddError}
            />
            <CalcInput
              name="requirement"
              label={data.variables.requirement.label}
              unit={data.variables.requirement.unit}
              hint={data.variables.requirement.hint}
              value={requirement}
              onChange={setRequirement}
              min={80}
              max={105}
              error={reqError}
            />

            {allValid && result !== null && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: data.formula,
                  inputs: [
                    { label: data.variables.wetMass.label, value: wetMass, unit: data.variables.wetMass.unit },
                    { label: data.variables.mouldMass.label, value: mouldMass, unit: data.variables.mouldMass.unit },
                    { label: data.variables.mouldVol.label, value: mouldVol, unit: data.variables.mouldVol.unit },
                    { label: data.variables.moisture.label, value: moisture, unit: data.variables.moisture.unit },
                    { label: data.variables.MDD.label, value: MDD, unit: data.variables.MDD.unit },
                    { label: data.variables.requirement.label, value: requirement, unit: data.variables.requirement.unit },
                    { label: "Wet Density", value: result.wetDensity.toFixed(3), unit: "Mg/m³" },
                  ],
                  result: {
                    label: `${data.result.dryDensity.label} — ${result.pass ? "PASS" : "FAIL"}`,
                    value: `${result.dryDensity.toFixed(3)} Mg/m³  (${result.compactionPercent.toFixed(1)}%)`,
                    unit: "",
                  },
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            <CalcResult
              label="Wet Density"
              value={result ? result.wetDensity : null}
              unit="Mg/m³"
            />
            <CalcResult
              label={data.result.dryDensity.label}
              value={result ? result.dryDensity : null}
              unit={data.result.dryDensity.unit}
            />
            <CalcResult
              label={data.result.compaction.label}
              value={result ? result.compactionPercent : null}
              unit={data.result.compaction.unit}
            />

            {result && (
              <div
                className={`rounded-2xl border p-4 text-center text-lg font-bold ${
                  result.pass
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-red-200 bg-red-50 text-red-800"
                }`}
              >
                {result.pass ? "PASS" : "FAIL"} — {result.compactionPercent.toFixed(1)}%
                {result.pass ? " ≥ " : " < "}
                {reqVal}%
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
            { label: data.variables.wetMass.label, value: wetMass, unit: data.variables.wetMass.unit },
            { label: data.variables.mouldMass.label, value: mouldMass, unit: data.variables.mouldMass.unit },
            { label: data.variables.mouldVol.label, value: mouldVol, unit: data.variables.mouldVol.unit },
            { label: data.variables.moisture.label, value: moisture, unit: data.variables.moisture.unit },
            { label: data.variables.MDD.label, value: MDD, unit: data.variables.MDD.unit },
            { label: data.variables.requirement.label, value: requirement, unit: data.variables.requirement.unit },
            { label: "Wet Density", value: result.wetDensity.toFixed(3), unit: "Mg/m³" },
          ]}
          result={{
            label: `${data.result.dryDensity.label} — ${result.pass ? "PASS" : "FAIL"}`,
            value: `${result.dryDensity.toFixed(3)} Mg/m³  (${result.compactionPercent.toFixed(1)}%)`,
            unit: "",
          }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
