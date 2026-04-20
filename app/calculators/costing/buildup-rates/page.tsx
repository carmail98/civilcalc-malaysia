"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { buildUpRates } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import KeyTerms from "@/components/KeyTerms";
import { keyTerms } from "@/data/key-terms";

const data = (formulaData as Record<string, any>).buildup_rates;

export default function BuildUpRatesPage() {
  const [labourCost, setLabourCost] = useState("");
  const [labourProductivity, setLabourProductivity] = useState("");
  const [materialCost, setMaterialCost] = useState("");
  const [materialWastage, setMaterialWastage] = useState("");
  const [plantCost, setPlantCost] = useState("");
  const [plantProductivity, setPlantProductivity] = useState("");
  const [overheadPercent, setOverheadPercent] = useState("");
  const [profitPercent, setProfitPercent] = useState("");

  const lcVal = parseFloat(labourCost);
  const lpVal = parseFloat(labourProductivity);
  const mcVal = parseFloat(materialCost);
  const mwVal = parseFloat(materialWastage);
  const pcVal = parseFloat(plantCost);
  const ppVal = parseFloat(plantProductivity);
  const ohVal = parseFloat(overheadPercent);
  const prVal = parseFloat(profitPercent);

  const { savedList, save, remove, clearAll, exportCalcs, importCalcs, isLoggedIn, syncing } = useCalcStorage("buildup-rates");

  const allValid =
    !isNaN(lcVal) && !isNaN(lpVal) && !isNaN(mcVal) && !isNaN(mwVal) &&
    !isNaN(pcVal) && !isNaN(ppVal) && !isNaN(ohVal) && !isNaN(prVal) &&
    lcVal > 0 && lpVal > 0 && mcVal > 0 && mwVal >= 0 &&
    pcVal > 0 && ppVal > 0 && ohVal >= 0 && prVal >= 0;

  const result = allValid
    ? buildUpRates(lcVal, lpVal, mcVal, mwVal, pcVal, ppVal, ohVal, prVal)
    : null;

  const fmt = (v: number) => v.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: "QS / Costing", href: "/calculators/costing" }, { label: "Build-Up Rates" }]} />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { labourCost, labourProductivity, materialCost, materialWastage, plantCost, plantProductivity, overheadPercent, profitPercent })}
          onLoad={(v) => { setLabourCost(v.labourCost ?? ""); setLabourProductivity(v.labourProductivity ?? ""); setMaterialCost(v.materialCost ?? ""); setMaterialWastage(v.materialWastage ?? ""); setPlantCost(v.plantCost ?? ""); setPlantProductivity(v.plantProductivity ?? ""); setOverheadPercent(v.overheadPercent ?? ""); setProfitPercent(v.profitPercent ?? ""); }}
          onRemove={remove}
          onExport={exportCalcs}
          onImport={importCalcs}
          onReset={() => { setLabourCost(""); setLabourProductivity(""); setMaterialCost(""); setMaterialWastage(""); setPlantCost(""); setPlantProductivity(""); setOverheadPercent(""); setProfitPercent(""); }}
          isLoggedIn={isLoggedIn}
          syncing={syncing}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />
        <KeyTerms terms={keyTerms["buildup-rates"].terms} standard={keyTerms["buildup-rates"].standard} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <CalcInput name="labourCost" label="Labour Cost" unit="RM/day" hint="Daily wage rate for worker" value={labourCost} onChange={setLabourCost} min={0} />
            <CalcInput name="labourProductivity" label="Labour Productivity" unit="unit/day" hint="Output per worker per day" value={labourProductivity} onChange={setLabourProductivity} min={0} />
            <CalcInput name="materialCost" label="Material Cost" unit="RM/unit" hint="Cost of material per unit" value={materialCost} onChange={setMaterialCost} min={0} />
            <CalcInput name="materialWastage" label="Material Wastage" unit="%" hint="Allowance for material wastage" value={materialWastage} onChange={setMaterialWastage} min={0} max={100} />
            <CalcInput name="plantCost" label="Plant Cost" unit="RM/day" hint="Daily plant hire rate" value={plantCost} onChange={setPlantCost} min={0} />
            <CalcInput name="plantProductivity" label="Plant Productivity" unit="unit/day" hint="Plant output per day" value={plantProductivity} onChange={setPlantProductivity} min={0} />
            <CalcInput name="overheadPercent" label="Overhead" unit="%" hint="Overhead percentage on net rate" value={overheadPercent} onChange={setOverheadPercent} min={0} max={100} />
            <CalcInput name="profitPercent" label="Profit" unit="%" hint="Profit percentage on net rate" value={profitPercent} onChange={setProfitPercent} min={0} max={100} />

            {allValid && result !== null && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: data.formula,
                  inputs: [
                    { label: "Labour Cost", value: labourCost, unit: "RM/day" },
                    { label: "Labour Productivity", value: labourProductivity, unit: "unit/day" },
                    { label: "Material Cost", value: materialCost, unit: "RM/unit" },
                    { label: "Material Wastage", value: materialWastage, unit: "%" },
                    { label: "Plant Cost", value: plantCost, unit: "RM/day" },
                    { label: "Plant Productivity", value: plantProductivity, unit: "unit/day" },
                    { label: "Overhead", value: overheadPercent, unit: "%" },
                    { label: "Profit", value: profitPercent, unit: "%" },
                  ],
                  result: {
                    label: "All-In Rate",
                    value: `RM ${fmt(result.allInRate)}/unit`,
                    unit: "",
                  },
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            <CalcResult label="Labour Rate" value={result ? result.labourRate : null} unit="RM/unit" />
            <CalcResult label="Material Rate" value={result ? result.materialRate : null} unit="RM/unit" />
            <CalcResult label="Plant Rate" value={result ? result.plantRate : null} unit="RM/unit" />
            <CalcResult label="Net Rate" value={result ? result.netRate : null} unit="RM/unit" />
            <CalcResult label="Overhead" value={result ? result.overhead : null} unit="RM/unit" />
            <CalcResult label="Profit" value={result ? result.profit : null} unit="RM/unit" />

            {result && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center">
                <p className="text-sm text-stone-600">All-In Rate</p>
                <p className="text-2xl font-bold text-stone-800">RM {fmt(result.allInRate)}/unit</p>
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
            { label: "Labour Cost", value: labourCost, unit: "RM/day" },
            { label: "Labour Productivity", value: labourProductivity, unit: "unit/day" },
            { label: "Material Cost", value: materialCost, unit: "RM/unit" },
            { label: "Material Wastage", value: materialWastage, unit: "%" },
            { label: "Plant Cost", value: plantCost, unit: "RM/day" },
            { label: "Plant Productivity", value: plantProductivity, unit: "unit/day" },
            { label: "Overhead", value: overheadPercent, unit: "%" },
            { label: "Profit", value: profitPercent, unit: "%" },
          ]}
          result={{
            label: "All-In Rate",
            value: `RM ${fmt(result.allInRate)}/unit`,
            unit: "",
          }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
