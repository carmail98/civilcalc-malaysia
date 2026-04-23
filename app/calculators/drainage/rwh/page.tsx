"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { rainwaterHarvesting } from "@/lib/calcEngine";
import { RWH_TOWNS } from "@/lib/msmaReferences";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";

const data = formulaData.rainwater_harvesting;

export default function RwhPage() {
  const [roof, setRoof] = useState("");
  const [townIdx, setTownIdx] = useState("3"); // Kuala Lumpur default
  const [demand, setDemand] = useState("");

  const roofVal = parseFloat(roof);
  const townIdxVal = parseInt(townIdx, 10);
  const demandVal = parseFloat(demand);

  const { savedList, save, remove, clearAll, exportCalcs, importCalcs, isLoggedIn, syncing } =
    useCalcStorage("rainwater-harvesting");

  const roofError =
    roof !== "" && !isNaN(roofVal) && roofVal <= 0
      ? "Roof area must be positive"
      : undefined;

  const demandError =
    demand !== "" && !isNaN(demandVal) && demandVal < 0
      ? "Demand cannot be negative"
      : undefined;

  const hasErrors = !!roofError || !!demandError;
  const allValid = !isNaN(roofVal) && roofVal > 0 && !isNaN(townIdxVal) && !hasErrors;

  const result = allValid
    ? rainwaterHarvesting(
        roofVal,
        townIdxVal,
        demand !== "" && !isNaN(demandVal) && demandVal > 0 ? demandVal : undefined
      )
    : null;

  return (
    <>
      <div className="print:hidden">
        <Breadcrumbs
          items={[
            { label: "Drainage", href: "/calculators/drainage" },
            { label: "Rainwater Harvesting" },
          ]}
        />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-800">
          <p>
            MSMA Equation 6.1 sizes the RWH tank as <strong>St = 0.01 × Ar</strong> (m³ per m² of
            roof) — equivalent to 10 mm of rainfall storage per unit roof area. This is a
            near-optimum value with ± 25 % variation (§6.4.5). Annual yield (AARY) values are
            scaled from Table 6.4 (base case: 1 m³ tank + 100 m² roof). For more accurate
            sizing, use the daily water balance model described in §6.4.3.
          </p>
        </div>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { roof, townIdx, demand })}
          onLoad={(v) => {
            setRoof(v.roof ?? "");
            setTownIdx(v.townIdx ?? "3");
            setDemand(v.demand ?? "");
          }}
          onRemove={remove}
          onExport={exportCalcs}
          onImport={importCalcs}
          onReset={() => {
            setRoof("");
            setTownIdx("3");
            setDemand("");
          }}
          isLoggedIn={isLoggedIn}
          syncing={syncing}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <CalcInput
              name="roof"
              label={data.variables.roofArea.label}
              unit={data.variables.roofArea.unit}
              hint={data.variables.roofArea.hint}
              value={roof}
              onChange={setRoof}
              min={0}
              error={roofError}
            />

            <h3 className="text-sm font-semibold text-stone-600 mb-2 mt-4 uppercase tracking-wide">
              Nearest Town (Table 6.2 / 6.4)
            </h3>
            <select
              value={townIdx}
              onChange={(e) => setTownIdx(e.target.value)}
              aria-label="Nearest town"
              title="Nearest town"
              className="w-full rounded-2xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 mb-4 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            >
              {RWH_TOWNS.map((t, i) => (
                <option key={t.station} value={i}>
                  {t.town} — MAR {t.mar_mm} mm, {t.rainDays} rain-days, AARY {t.aary_m3} m³
                </option>
              ))}
            </select>

            <CalcInput
              name="demand"
              label={data.variables.demand.label}
              unit={data.variables.demand.unit}
              hint={data.variables.demand.hint}
              value={demand}
              onChange={setDemand}
              min={0}
              error={demandError}
            />

            {allValid && result && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: data.formula,
                  inputs: [
                    { label: "Roof Area", value: roof, unit: "m²" },
                    { label: "Town", value: result.town, unit: "—" },
                    { label: "Mean Annual Rainfall", value: String(result.mar_mm), unit: "mm" },
                    { label: "Daily Demand", value: demand || "—", unit: "L/day" },
                  ],
                  result: {
                    label: "Recommended Tank Size",
                    value: result.tankSize_m3.toFixed(2),
                    unit: "m³",
                  },
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            <CalcResult
              label="Recommended Tank Size (St)"
              value={result?.tankSize_m3 ?? null}
              unit="m³"
            />
            {result && (
              <div className="rounded-2xl bg-stone-50 border border-stone-200 p-3 text-xs text-stone-600 space-y-1">
                <p>
                  <strong>Range (± 25 %):</strong> {result.tankSizeMin_m3.toFixed(2)}–
                  {result.tankSizeMax_m3.toFixed(2)} m³
                </p>
                <p>
                  <strong>Indicative annual yield (AARY):</strong>{" "}
                  {result.aary_m3.toFixed(1)} m³/yr
                </p>
                <p>
                  <strong>First flush volume (Table 6.3):</strong>{" "}
                  {result.firstFlushMin_m3 === result.firstFlushMax_m3
                    ? `${result.firstFlushMin_m3} m³`
                    : `${result.firstFlushMin_m3}–${result.firstFlushMax_m3} m³`}{" "}
                  ({result.firstFlushNote})
                </p>
                {result.demandSatisfiedDays !== null && (
                  <p>
                    <strong>Demand coverage:</strong> yield covers ≈{" "}
                    {result.demandSatisfiedDays.toFixed(0)} days/year at stated demand
                  </p>
                )}
              </div>
            )}

            {result && result.notes.length > 0 && (
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs text-stone-600">
                <p className="font-semibold mb-1">Notes:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {result.notes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <Disclaimer text={data.disclaimer} />
      </div>

      {allValid && result && (
        <PrintNote
          title={data.name}
          reference={data.reference}
          formula={data.formula}
          inputs={[
            { label: "Roof Area", value: roof, unit: "m²" },
            { label: "Town", value: result.town, unit: "—" },
            { label: "Mean Annual Rainfall", value: String(result.mar_mm), unit: "mm" },
          ]}
          result={{
            label: "Tank Size / AARY",
            value: `${result.tankSize_m3.toFixed(2)} m³ / ${result.aary_m3.toFixed(1)} m³/yr`,
            unit: "",
          }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
