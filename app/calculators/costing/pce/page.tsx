"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { preliminaryCostEstimate } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import KeyTerms from "@/components/KeyTerms";
import { keyTerms } from "@/data/key-terms";

const data = (formulaData as Record<string, any>).preliminary_cost;

const buildingTypes = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "industrial", label: "Industrial" },
  { value: "institutional", label: "Institutional" },
  { value: "infrastructure", label: "Infrastructure" },
];

const locations = [
  { value: "urban", label: "Urban" },
  { value: "suburban", label: "Suburban" },
  { value: "rural", label: "Rural" },
];

export default function PreliminaryCostEstimatePage() {
  const [gfa, setGfa] = useState("");
  const [buildingType, setBuildingType] = useState("residential");
  const [storey, setStorey] = useState("");
  const [location, setLocation] = useState("urban");
  const [year, setYear] = useState("2026");

  const gfaVal = parseFloat(gfa);
  const storeyVal = parseFloat(storey);
  const yearVal = parseFloat(year);

  const { savedList, save, remove, clearAll, exportCalcs, importCalcs, isLoggedIn, syncing } = useCalcStorage("preliminary-cost");

  const allValid =
    !isNaN(gfaVal) &&
    !isNaN(storeyVal) &&
    !isNaN(yearVal) &&
    gfaVal > 0 &&
    storeyVal > 0 &&
    yearVal > 0;

  const result = allValid
    ? preliminaryCostEstimate(
        gfaVal,
        buildingType as "residential" | "commercial" | "industrial" | "institutional" | "infrastructure",
        storeyVal,
        location as "urban" | "suburban" | "rural",
        yearVal
      )
    : null;

  const fmt = (v: number) => v.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: "QS / Costing", href: "/calculators/costing" }, { label: "Preliminary Cost Estimate" }]} />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { gfa, buildingType, storey, location, year })}
          onLoad={(v) => { setGfa(v.gfa ?? ""); setBuildingType(v.buildingType ?? "residential"); setStorey(v.storey ?? ""); setLocation(v.location ?? "urban"); setYear(v.year ?? "2026"); }}
          onRemove={remove}
          onExport={exportCalcs}
          onImport={importCalcs}
          isLoggedIn={isLoggedIn}
          syncing={syncing}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />
        <KeyTerms terms={keyTerms["preliminary-cost"].terms} standard={keyTerms["preliminary-cost"].standard} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <CalcInput
              name="gfa"
              label="Gross Floor Area"
              unit="m²"
              hint="Total gross floor area of the building"
              value={gfa}
              onChange={setGfa}
              min={0}
            />

            {/* Building Type select */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Building Type
              </label>
              <select
                value={buildingType}
                onChange={(e) => setBuildingType(e.target.value)}
                className="w-full rounded-2xl border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:border-amber-500 focus:ring-amber-500"
              >
                {buildingTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <CalcInput
              name="storey"
              label="Number of Storeys"
              unit=""
              hint="Total number of storeys"
              value={storey}
              onChange={setStorey}
              min={1}
            />

            {/* Location select */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-2xl border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:border-amber-500 focus:ring-amber-500"
              >
                {locations.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>

            <CalcInput
              name="year"
              label="Year of Estimate"
              unit=""
              hint="Year for inflation adjustment (base year 2024)"
              value={year}
              onChange={setYear}
              min={2020}
            />

            {allValid && result !== null && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: data.formula,
                  inputs: [
                    { label: "Gross Floor Area", value: gfa, unit: "m²" },
                    { label: "Building Type", value: buildingType, unit: "" },
                    { label: "Number of Storeys", value: storey, unit: "" },
                    { label: "Location", value: location, unit: "" },
                    { label: "Year", value: year, unit: "" },
                  ],
                  result: {
                    label: "Total Project Cost",
                    value: `RM ${fmt(result.totalProjectCost)}`,
                    unit: "",
                  },
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            <CalcResult label="Base Rate" value={result ? result.baseRate : null} unit="RM/m²" />
            <CalcResult label="Location Factor" value={result ? result.locationFactor : null} unit="" />
            <CalcResult label="Storey Factor" value={result ? result.storeyFactor : null} unit="" />
            <CalcResult label="Inflation Factor" value={result ? result.inflationFactor : null} unit="" />
            <CalcResult label="Adjusted Rate" value={result ? result.adjustedRate : null} unit="RM/m²" />

            {result && (
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 space-y-2">
                <div className="flex justify-between text-sm text-stone-700">
                  <span>Estimated Cost</span>
                  <span className="font-semibold">RM {fmt(result.estimatedCost)}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-700">
                  <span>Contingency</span>
                  <span className="font-semibold">RM {fmt(result.contingency)}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-700">
                  <span>Professional Fees</span>
                  <span className="font-semibold">RM {fmt(result.professionalFees)}</span>
                </div>
                <hr className="border-stone-300" />
                <div className="flex justify-between text-base font-bold text-stone-800">
                  <span>Total Project Cost</span>
                  <span>RM {fmt(result.totalProjectCost)}</span>
                </div>
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
            { label: "Gross Floor Area", value: gfa, unit: "m²" },
            { label: "Building Type", value: buildingType, unit: "" },
            { label: "Number of Storeys", value: storey, unit: "" },
            { label: "Location", value: location, unit: "" },
            { label: "Year", value: year, unit: "" },
            { label: "Base Rate", value: result.baseRate.toFixed(2), unit: "RM/m²" },
            { label: "Location Factor", value: result.locationFactor.toFixed(2), unit: "" },
            { label: "Storey Factor", value: result.storeyFactor.toFixed(2), unit: "" },
            { label: "Inflation Factor", value: result.inflationFactor.toFixed(4), unit: "" },
            { label: "Adjusted Rate", value: result.adjustedRate.toFixed(2), unit: "RM/m²" },
          ]}
          result={{
            label: "Total Project Cost",
            value: `RM ${fmt(result.totalProjectCost)}`,
            unit: "",
          }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
