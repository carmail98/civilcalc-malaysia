"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { pileCapacity } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import KeyTerms from "@/components/KeyTerms";
import { keyTerms } from "@/data/key-terms";

const data = (formulaData as Record<string, any>).pile_capacity;

const pileTypeOptions = [
  { value: "bored", label: "Bored Pile" },
  { value: "driven", label: "Driven Pile" },
];

const soilTypeOptions = [
  { value: "cohesive", label: "Cohesive (Clay/Silt)" },
  { value: "granular", label: "Granular (Sand/Gravel)" },
];

export default function PileCapacityPage() {
  const [pileType, setPileType] = useState("bored");
  const [soilType, setSoilType] = useState("cohesive");
  const [pileDia, setPileDia] = useState("");
  const [pileLength, setPileLength] = useState("");
  const [cu, setCu] = useState("");
  const [phi, setPhi] = useState("");
  const [gamma, setGamma] = useState("");
  const [FOS, setFOS] = useState("2.5");

  const pileDiaVal = parseFloat(pileDia);
  const pileLengthVal = parseFloat(pileLength);
  const cuVal = parseFloat(cu);
  const phiVal = parseFloat(phi);
  const gammaVal = parseFloat(gamma);
  const FOSVal = parseFloat(FOS);

  const { savedList, save, remove, clearAll, exportCalcs, importCalcs, isLoggedIn, syncing } = useCalcStorage("pile-capacity");

  const allValid =
    !isNaN(pileDiaVal) && pileDiaVal > 0 &&
    !isNaN(pileLengthVal) && pileLengthVal > 0 &&
    !isNaN(gammaVal) && gammaVal > 0 &&
    !isNaN(FOSVal) && FOSVal > 0 &&
    (soilType === "cohesive"
      ? !isNaN(cuVal) && cuVal > 0
      : !isNaN(phiVal) && phiVal > 0);

  const result = allValid
    ? pileCapacity(
        pileType as "bored" | "driven",
        soilType as "cohesive" | "granular",
        pileDiaVal,
        pileLengthVal,
        cuVal || 0,
        phiVal || 0,
        gammaVal,
        FOSVal,
        1,
        [pileLengthVal]
      )
    : null;

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: "Geotechnical", href: "/calculators/geotechnical" }, { label: "Pile Capacity" }]} />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { pileType, soilType, pileDia, pileLength, cu, phi, gamma, FOS })}
          onLoad={(v) => {
            setPileType(v.pileType ?? "bored");
            setSoilType(v.soilType ?? "cohesive");
            setPileDia(v.pileDia ?? "");
            setPileLength(v.pileLength ?? "");
            setCu(v.cu ?? "");
            setPhi(v.phi ?? "");
            setGamma(v.gamma ?? "");
            setFOS(v.FOS ?? "2.5");
          }}
          onRemove={remove}
          onExport={exportCalcs}
          onImport={importCalcs}
          isLoggedIn={isLoggedIn}
          syncing={syncing}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />

        <div className="grid gap-2 md:grid-cols-2 mb-6">
          {Object.entries(data.sub_formulas as Record<string, string>).map(([key, formula]) => (
            <div key={key} className="rounded-2xl bg-stone-50 border border-stone-200 p-3">
              <p className="text-sm font-mono text-stone-700">{formula}</p>
            </div>
          ))}
        </div>

        <KeyTerms terms={keyTerms["pile-capacity"].terms} standard={keyTerms["pile-capacity"].standard} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">Pile Type</h3>
            <div className="mb-4">
              <select
                value={pileType}
                onChange={(e) => setPileType(e.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 focus:border-amber-500 focus:ring-amber-500"
              >
                {pileTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <h3 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">Soil Type</h3>
            <div className="mb-4">
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 focus:border-amber-500 focus:ring-amber-500"
              >
                {soilTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <h3 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">Pile Geometry</h3>
            <CalcInput name="pileDia" label={data.variables.pileDia.label} unit={data.variables.pileDia.unit} hint={data.variables.pileDia.hint} value={pileDia} onChange={setPileDia} min={0} />
            <CalcInput name="pileLength" label={data.variables.pileLength.label} unit={data.variables.pileLength.unit} hint={data.variables.pileLength.hint} value={pileLength} onChange={setPileLength} min={0} />

            <h3 className="text-sm font-semibold text-stone-600 mb-2 mt-6 uppercase tracking-wide">Soil Properties</h3>
            {soilType === "cohesive" ? (
              <CalcInput name="cu" label={data.variables.cu.label} unit={data.variables.cu.unit} hint={data.variables.cu.hint} value={cu} onChange={setCu} min={0} />
            ) : (
              <CalcInput name="phi" label={data.variables.phi.label} unit={data.variables.phi.unit} hint={data.variables.phi.hint} value={phi} onChange={setPhi} min={0} />
            )}
            <CalcInput name="gamma" label={data.variables.gamma.label} unit={data.variables.gamma.unit} hint={data.variables.gamma.hint} value={gamma} onChange={setGamma} min={0} />

            <h3 className="text-sm font-semibold text-stone-600 mb-2 mt-6 uppercase tracking-wide">Design</h3>
            <CalcInput name="FOS" label={data.variables.FOS.label} unit={data.variables.FOS.unit} hint={data.variables.FOS.hint} value={FOS} onChange={setFOS} min={0} />

            {allValid && result && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: data.formula,
                  inputs: [
                    { label: "Pile Type", value: pileTypeOptions.find(o => o.value === pileType)?.label ?? pileType, unit: "" },
                    { label: "Soil Type", value: soilTypeOptions.find(o => o.value === soilType)?.label ?? soilType, unit: "" },
                    { label: data.variables.pileDia.label, value: pileDia, unit: data.variables.pileDia.unit },
                    { label: data.variables.pileLength.label, value: pileLength, unit: data.variables.pileLength.unit },
                    ...(soilType === "cohesive"
                      ? [{ label: data.variables.cu.label, value: cu, unit: data.variables.cu.unit }]
                      : [{ label: data.variables.phi.label, value: phi, unit: data.variables.phi.unit }]),
                    { label: data.variables.gamma.label, value: gamma, unit: data.variables.gamma.unit },
                    { label: data.variables.FOS.label, value: FOS, unit: "" },
                  ],
                  result: {
                    label: "Allowable Pile Capacity",
                    value: result.Qallowable.toFixed(1),
                    unit: "kN",
                  },
                  additionalResults: [
                    { label: "End Bearing (Qb)", value: result.Qb.toFixed(1), unit: "kN" },
                    { label: "Shaft Friction (Qs)", value: result.Qs.toFixed(1), unit: "kN" },
                    { label: "Ultimate Capacity (Qult)", value: result.Qult.toFixed(1), unit: "kN" },
                    { label: "End Bearing Stress", value: result.endBearingStress.toFixed(1), unit: "kPa" },
                    { label: "Avg Shaft Friction", value: result.avgShaftFriction.toFixed(1), unit: "kPa" },
                  ],
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            {result ? (
              <>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">End Bearing</h3>
                <CalcResult label="End Bearing Stress" value={result.endBearingStress} unit="kPa" />
                <CalcResult label="End Bearing (Qb)" value={result.Qb} unit="kN" />

                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 pt-2">Shaft Friction</h3>
                <CalcResult label="Average Shaft Friction" value={result.avgShaftFriction} unit="kPa" />
                <CalcResult label="Shaft Friction (Qs)" value={result.Qs} unit="kN" />

                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 pt-2">Total Capacity</h3>
                <CalcResult label={data.result.Qult.label} value={result.Qult} unit={data.result.Qult.unit} />
                <CalcResult label={data.result.Qallowable.label} value={result.Qallowable} unit={data.result.Qallowable.unit} />

                <div className="rounded-2xl bg-stone-50 border border-stone-200 p-3 text-sm text-stone-700">
                  <p><strong>Qb / Qult:</strong> {((result.Qb / result.Qult) * 100).toFixed(1)}% end bearing</p>
                  <p><strong>Qs / Qult:</strong> {((result.Qs / result.Qult) * 100).toFixed(1)}% shaft friction</p>
                </div>
              </>
            ) : (
              <>
                <CalcResult label="End Bearing (Qb)" value={null} unit="kN" />
                <CalcResult label="Shaft Friction (Qs)" value={null} unit="kN" />
                <CalcResult label="Ultimate Capacity (Qult)" value={null} unit="kN" />
                <CalcResult label="Allowable Capacity" value={null} unit="kN" />
              </>
            )}
          </div>
        </div>

        <Disclaimer text={data.disclaimer} />
      </div>

      {/* Print view */}
      {allValid && result && (
        <PrintNote
          title={data.name}
          reference={data.reference}
          formula={data.formula}
          inputs={[
            { label: "Pile Type", value: pileTypeOptions.find(o => o.value === pileType)?.label ?? pileType, unit: "" },
            { label: "Soil Type", value: soilTypeOptions.find(o => o.value === soilType)?.label ?? soilType, unit: "" },
            { label: data.variables.pileDia.label, value: pileDia, unit: data.variables.pileDia.unit },
            { label: data.variables.pileLength.label, value: pileLength, unit: data.variables.pileLength.unit },
            ...(soilType === "cohesive"
              ? [{ label: data.variables.cu.label, value: cu, unit: data.variables.cu.unit }]
              : [{ label: data.variables.phi.label, value: phi, unit: data.variables.phi.unit }]),
            { label: data.variables.gamma.label, value: gamma, unit: data.variables.gamma.unit },
            { label: data.variables.FOS.label, value: FOS, unit: "" },
          ]}
          result={{ label: "Allowable Pile Capacity", value: result.Qallowable.toFixed(1), unit: "kN" }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
