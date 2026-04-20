"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { variationOrder } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import KeyTerms from "@/components/KeyTerms";
import { keyTerms } from "@/data/key-terms";

const data = (formulaData as Record<string, any>).variation_order;

export default function VariationOrderPage() {
  const [originalContract, setOriginalContract] = useState("");
  const [additions, setAdditions] = useState("");
  const [omissions, setOmissions] = useState("");
  const [dayworkLabour, setDayworkLabour] = useState("");
  const [dayworkMaterial, setDayworkMaterial] = useState("");
  const [dayworkPlant, setDayworkPlant] = useState("");
  const [eot, setEot] = useState("");

  const ocVal = parseFloat(originalContract);
  const addVal = parseFloat(additions);
  const omVal = parseFloat(omissions);
  const dlVal = parseFloat(dayworkLabour);
  const dmVal = parseFloat(dayworkMaterial);
  const dpVal = parseFloat(dayworkPlant);
  const eotVal = parseFloat(eot);

  const { savedList, save, remove, clearAll, exportCalcs, importCalcs, isLoggedIn, syncing } = useCalcStorage("variation-order");

  const allValid =
    !isNaN(ocVal) && !isNaN(addVal) && !isNaN(omVal) &&
    !isNaN(dlVal) && !isNaN(dmVal) && !isNaN(dpVal) && !isNaN(eotVal) &&
    ocVal > 0 && addVal >= 0 && omVal >= 0 &&
    dlVal >= 0 && dmVal >= 0 && dpVal >= 0 && eotVal >= 0;

  const result = allValid
    ? variationOrder(ocVal, [addVal], [omVal], dlVal, dmVal, dpVal, eotVal)
    : null;

  const fmt = (v: number) => v.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: "QS / Costing", href: "/calculators/costing" }, { label: "Variation Order" }]} />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { originalContract, additions, omissions, dayworkLabour, dayworkMaterial, dayworkPlant, eot })}
          onLoad={(v) => { setOriginalContract(v.originalContract ?? ""); setAdditions(v.additions ?? ""); setOmissions(v.omissions ?? ""); setDayworkLabour(v.dayworkLabour ?? ""); setDayworkMaterial(v.dayworkMaterial ?? ""); setDayworkPlant(v.dayworkPlant ?? ""); setEot(v.eot ?? ""); }}
          onRemove={remove}
          onExport={exportCalcs}
          onImport={importCalcs}
          onReset={() => { setOriginalContract(""); setAdditions(""); setOmissions(""); setDayworkLabour(""); setDayworkMaterial(""); setDayworkPlant(""); setEot(""); }}
          isLoggedIn={isLoggedIn}
          syncing={syncing}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />
        <KeyTerms terms={keyTerms["variation-order"].terms} standard={keyTerms["variation-order"].standard} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <CalcInput name="originalContract" label="Original Contract Sum" unit="RM" hint="Original contract value" value={originalContract} onChange={setOriginalContract} min={0} />
            <CalcInput name="additions" label="Additions" unit="RM" hint="Total value of additional works" value={additions} onChange={setAdditions} min={0} />
            <CalcInput name="omissions" label="Omissions" unit="RM" hint="Total value of omitted works" value={omissions} onChange={setOmissions} min={0} />
            <CalcInput name="dayworkLabour" label="Daywork Labour" unit="RM" hint="Daywork labour cost" value={dayworkLabour} onChange={setDayworkLabour} min={0} />
            <CalcInput name="dayworkMaterial" label="Daywork Material" unit="RM" hint="Daywork material cost" value={dayworkMaterial} onChange={setDayworkMaterial} min={0} />
            <CalcInput name="dayworkPlant" label="Daywork Plant" unit="RM" hint="Daywork plant cost" value={dayworkPlant} onChange={setDayworkPlant} min={0} />
            <CalcInput name="eot" label="Extension of Time" unit="days" hint="Number of EOT days claimed" value={eot} onChange={setEot} min={0} />

            {allValid && result !== null && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: data.formula,
                  inputs: [
                    { label: "Original Contract Sum", value: originalContract, unit: "RM" },
                    { label: "Additions", value: additions, unit: "RM" },
                    { label: "Omissions", value: omissions, unit: "RM" },
                    { label: "Daywork Labour", value: dayworkLabour, unit: "RM" },
                    { label: "Daywork Material", value: dayworkMaterial, unit: "RM" },
                    { label: "Daywork Plant", value: dayworkPlant, unit: "RM" },
                    { label: "EOT", value: eot, unit: "days" },
                  ],
                  result: {
                    label: `Revised Contract — ${result.withinLimit ? "Within Limit" : "Exceeds Limit"}`,
                    value: `RM ${fmt(result.revisedContract)}`,
                    unit: "",
                  },
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            <CalcResult label="Total Additions" value={result ? result.totalAdditions : null} unit="RM" />
            <CalcResult label="Total Omissions" value={result ? result.totalOmissions : null} unit="RM" />
            <CalcResult label="Net VO" value={result ? result.netVO : null} unit="RM" />
            <CalcResult label="Daywork Total" value={result ? result.dayworkTotal : null} unit="RM" />
            <CalcResult label="Total VO Value" value={result ? result.totalVOValue : null} unit="RM" />
            <CalcResult label="Revised Contract" value={result ? result.revisedContract : null} unit="RM" />
            <CalcResult label="VO Percentage" value={result ? result.voPercent : null} unit="%" />

            {result && (
              <div
                className={`rounded-2xl border p-4 text-center text-lg font-bold ${
                  result.withinLimit
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-red-200 bg-red-50 text-red-800"
                }`}
              >
                {result.withinLimit ? "WITHIN LIMIT" : "EXCEEDS LIMIT"} — {result.voPercent.toFixed(1)}% of original contract
                {result.withinLimit ? " (≤ 30%)" : " (> 30%)"}
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
            { label: "Original Contract Sum", value: originalContract, unit: "RM" },
            { label: "Additions", value: additions, unit: "RM" },
            { label: "Omissions", value: omissions, unit: "RM" },
            { label: "Daywork Labour", value: dayworkLabour, unit: "RM" },
            { label: "Daywork Material", value: dayworkMaterial, unit: "RM" },
            { label: "Daywork Plant", value: dayworkPlant, unit: "RM" },
            { label: "EOT", value: eot, unit: "days" },
          ]}
          result={{
            label: `Revised Contract — ${result.withinLimit ? "Within Limit" : "Exceeds Limit"}`,
            value: `RM ${fmt(result.revisedContract)}`,
            unit: "",
          }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
