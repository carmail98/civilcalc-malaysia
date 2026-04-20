"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { waterDemandCalc } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import KeyTerms from "@/components/KeyTerms";
import { keyTerms } from "@/data/key-terms";

const data = (formulaData as Record<string, any>).water_demand;

export default function WaterDemandPage() {
  const [population, setPopulation] = useState("");
  const [perCapitaDemand, setPerCapitaDemand] = useState("230");
  const [nonRevenueFactor, setNonRevenueFactor] = useState("35");
  const [peakDayFactor, setPeakDayFactor] = useState("1.3");
  const [peakHourFactor, setPeakHourFactor] = useState("2.0");
  const [fireFlow, setFireFlow] = useState("0");
  const [commercialDemand, setCommercialDemand] = useState("0");
  const [industrialDemand, setIndustrialDemand] = useState("0");

  const popVal = parseFloat(population);
  const pcdVal = parseFloat(perCapitaDemand);
  const nrwVal = parseFloat(nonRevenueFactor);
  const pdfVal = parseFloat(peakDayFactor);
  const phfVal = parseFloat(peakHourFactor);
  const ffVal = parseFloat(fireFlow);
  const comVal = parseFloat(commercialDemand);
  const indVal = parseFloat(industrialDemand);

  const { savedList, save, remove, clearAll, exportCalcs, importCalcs, isLoggedIn, syncing } = useCalcStorage("water-demand");

  // Validation
  const popError =
    population !== "" && !isNaN(popVal) && popVal <= 0
      ? "Population must be positive"
      : undefined;

  const pcdError =
    perCapitaDemand !== "" && !isNaN(pcdVal)
      ? pcdVal <= 0
        ? "Per capita demand must be positive"
        : pcdVal > 500
        ? "Per capita demand exceeds typical range"
        : undefined
      : undefined;

  const nrwError =
    nonRevenueFactor !== "" && !isNaN(nrwVal)
      ? nrwVal < 0
        ? "NRW factor cannot be negative"
        : nrwVal > 80
        ? "NRW factor exceeds realistic range"
        : undefined
      : undefined;

  const pdfError =
    peakDayFactor !== "" && !isNaN(pdfVal) && pdfVal <= 0
      ? "Peak day factor must be positive"
      : undefined;

  const phfError =
    peakHourFactor !== "" && !isNaN(phfVal) && phfVal <= 0
      ? "Peak hour factor must be positive"
      : undefined;

  const ffError =
    fireFlow !== "" && !isNaN(ffVal) && ffVal < 0
      ? "Fire flow cannot be negative"
      : undefined;

  const comError =
    commercialDemand !== "" && !isNaN(comVal) && comVal < 0
      ? "Commercial demand cannot be negative"
      : undefined;

  const indError =
    industrialDemand !== "" && !isNaN(indVal) && indVal < 0
      ? "Industrial demand cannot be negative"
      : undefined;

  const hasErrors =
    !!popError || !!pcdError || !!nrwError || !!pdfError || !!phfError || !!ffError || !!comError || !!indError;

  const allValid =
    !isNaN(popVal) &&
    popVal > 0 &&
    !isNaN(pcdVal) &&
    pcdVal > 0 &&
    !isNaN(nrwVal) &&
    nrwVal >= 0 &&
    !isNaN(pdfVal) &&
    pdfVal > 0 &&
    !isNaN(phfVal) &&
    phfVal > 0 &&
    !isNaN(ffVal) &&
    ffVal >= 0 &&
    !isNaN(comVal) &&
    comVal >= 0 &&
    !isNaN(indVal) &&
    indVal >= 0 &&
    !hasErrors;

  const result = allValid
    ? waterDemandCalc(popVal, pcdVal, nrwVal, pdfVal, phfVal, ffVal, comVal, indVal)
    : null;

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: "Environmental", href: "/calculators/environmental" }, { label: "Water Demand" }]} />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { population, perCapitaDemand, nonRevenueFactor, peakDayFactor, peakHourFactor, fireFlow, commercialDemand, industrialDemand })}
          onLoad={(v) => {
            setPopulation(v.population ?? "");
            setPerCapitaDemand(v.perCapitaDemand ?? "230");
            setNonRevenueFactor(v.nonRevenueFactor ?? "35");
            setPeakDayFactor(v.peakDayFactor ?? "1.3");
            setPeakHourFactor(v.peakHourFactor ?? "2.0");
            setFireFlow(v.fireFlow ?? "0");
            setCommercialDemand(v.commercialDemand ?? "0");
            setIndustrialDemand(v.industrialDemand ?? "0");
          }}
          onRemove={remove}
          onExport={exportCalcs}
          onImport={importCalcs}
          onReset={() => { setPopulation(""); setPerCapitaDemand("230"); setNonRevenueFactor("35"); setPeakDayFactor("1.3"); setPeakHourFactor("2.0"); setFireFlow("0"); setCommercialDemand("0"); setIndustrialDemand("0"); }}
          isLoggedIn={isLoggedIn}
          syncing={syncing}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />

        {/* Sub-formulas */}
        <div className="grid gap-2 md:grid-cols-2 mb-6">
          <div className="rounded-2xl bg-stone-50 border border-stone-200 p-3">
            <p className="text-sm font-mono text-stone-700">{data.sub_formulas.peak_day}</p>
            <p className="text-xs text-stone-400 mt-1">Peak Day Demand</p>
          </div>
          <div className="rounded-2xl bg-stone-50 border border-stone-200 p-3">
            <p className="text-sm font-mono text-stone-700">{data.sub_formulas.peak_hour}</p>
            <p className="text-xs text-stone-400 mt-1">Peak Hour Demand</p>
          </div>
        </div>

        <KeyTerms terms={keyTerms["water-demand"].terms} standard={keyTerms["water-demand"].standard} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">
              Population & Domestic
            </h3>
            <CalcInput
              name="population"
              label={data.variables.population.label}
              unit={data.variables.population.unit}
              hint={data.variables.population.hint}
              value={population}
              onChange={setPopulation}
              min={0}
              error={popError}
            />
            <CalcInput
              name="perCapitaDemand"
              label={data.variables.perCapitaDemand.label}
              unit={data.variables.perCapitaDemand.unit}
              hint={data.variables.perCapitaDemand.hint}
              value={perCapitaDemand}
              onChange={setPerCapitaDemand}
              min={0}
              error={pcdError}
            />
            <CalcInput
              name="nonRevenueFactor"
              label={data.variables.nonRevenueFactor.label}
              unit={data.variables.nonRevenueFactor.unit}
              hint={data.variables.nonRevenueFactor.hint}
              value={nonRevenueFactor}
              onChange={setNonRevenueFactor}
              min={0}
              max={80}
              error={nrwError}
            />

            <h3 className="text-sm font-semibold text-stone-600 mb-2 mt-6 uppercase tracking-wide">
              Peak Factors
            </h3>
            <CalcInput
              name="peakDayFactor"
              label={data.variables.peakDayFactor.label}
              unit={data.variables.peakDayFactor.unit}
              hint={data.variables.peakDayFactor.hint}
              value={peakDayFactor}
              onChange={setPeakDayFactor}
              min={0}
              error={pdfError}
            />
            <CalcInput
              name="peakHourFactor"
              label={data.variables.peakHourFactor.label}
              unit={data.variables.peakHourFactor.unit}
              hint={data.variables.peakHourFactor.hint}
              value={peakHourFactor}
              onChange={setPeakHourFactor}
              min={0}
              error={phfError}
            />

            <h3 className="text-sm font-semibold text-stone-600 mb-2 mt-6 uppercase tracking-wide">
              Additional Demand
            </h3>
            <CalcInput
              name="fireFlow"
              label={data.variables.fireFlow.label}
              unit={data.variables.fireFlow.unit}
              hint={data.variables.fireFlow.hint}
              value={fireFlow}
              onChange={setFireFlow}
              min={0}
              error={ffError}
            />
            <CalcInput
              name="commercialDemand"
              label={data.variables.commercialDemand.label}
              unit={data.variables.commercialDemand.unit}
              hint={data.variables.commercialDemand.hint}
              value={commercialDemand}
              onChange={setCommercialDemand}
              min={0}
              error={comError}
            />
            <CalcInput
              name="industrialDemand"
              label={data.variables.industrialDemand.label}
              unit={data.variables.industrialDemand.unit}
              hint={data.variables.industrialDemand.hint}
              value={industrialDemand}
              onChange={setIndustrialDemand}
              min={0}
              error={indError}
            />

            {allValid && result !== null && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: `${data.formula}  |  ${data.sub_formulas.peak_day}  |  ${data.sub_formulas.peak_hour}`,
                  inputs: [
                    { label: data.variables.population.label, value: population, unit: data.variables.population.unit },
                    { label: data.variables.perCapitaDemand.label, value: perCapitaDemand, unit: data.variables.perCapitaDemand.unit },
                    { label: data.variables.nonRevenueFactor.label, value: nonRevenueFactor, unit: data.variables.nonRevenueFactor.unit },
                    { label: data.variables.peakDayFactor.label, value: peakDayFactor, unit: data.variables.peakDayFactor.unit || "\u2014" },
                    { label: data.variables.peakHourFactor.label, value: peakHourFactor, unit: data.variables.peakHourFactor.unit || "\u2014" },
                    { label: data.variables.fireFlow.label, value: fireFlow, unit: data.variables.fireFlow.unit },
                    { label: data.variables.commercialDemand.label, value: commercialDemand, unit: data.variables.commercialDemand.unit },
                    { label: data.variables.industrialDemand.label, value: industrialDemand, unit: data.variables.industrialDemand.unit },
                  ],
                  result: {
                    label: data.result.productionDemand.label,
                    value: result.productionDemand.toFixed(2),
                    unit: data.result.productionDemand.unit,
                  },
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            {result !== null && (
              <>
                {/* Demand breakdown */}
                <div className="rounded-2xl border border-stone-200 bg-white p-4">
                  <h4 className="text-sm font-semibold text-stone-700 mb-3">
                    Demand Breakdown
                  </h4>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-stone-100">
                        <td className="py-1.5 text-stone-600">Domestic Demand</td>
                        <td className="py-1.5 text-right font-medium text-stone-800">
                          {result.domesticDemand.toFixed(2)} m&sup3;/day
                        </td>
                      </tr>
                      {comVal > 0 && (
                        <tr className="border-b border-stone-100">
                          <td className="py-1.5 text-stone-600">Commercial Demand</td>
                          <td className="py-1.5 text-right font-medium text-stone-800">
                            {comVal.toFixed(2)} m&sup3;/day
                          </td>
                        </tr>
                      )}
                      {indVal > 0 && (
                        <tr className="border-b border-stone-100">
                          <td className="py-1.5 text-stone-600">Industrial Demand</td>
                          <td className="py-1.5 text-right font-medium text-stone-800">
                            {indVal.toFixed(2)} m&sup3;/day
                          </td>
                        </tr>
                      )}
                      <tr className="border-b border-stone-100">
                        <td className="py-1.5 text-stone-600">Total Average Daily</td>
                        <td className="py-1.5 text-right font-medium text-stone-800">
                          {result.totalAvgDaily.toFixed(2)} m&sup3;/day
                        </td>
                      </tr>
                      <tr className="border-b border-stone-100">
                        <td className="py-1.5 text-stone-600">NRW Allowance ({nonRevenueFactor}%)</td>
                        <td className="py-1.5 text-right font-medium text-stone-800">
                          {result.nrwAllowance.toFixed(2)} m&sup3;/day
                        </td>
                      </tr>
                      <tr className="bg-amber-50 font-semibold">
                        <td className="py-2 text-amber-900">Production Demand</td>
                        <td className="py-2 text-right text-amber-700">
                          {result.productionDemand.toFixed(2)} m&sup3;/day
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <CalcResult
                  label="Peak Day Demand"
                  value={result.peakDayDemand}
                  unit="m&sup3;/day"
                />
                <CalcResult
                  label="Peak Hour Demand"
                  value={result.peakHourDemand}
                  unit="m&sup3;/day"
                />

                {ffVal > 0 && (
                  <CalcResult
                    label="Peak Hour + Fire Flow"
                    value={result.withFireFlow}
                    unit="m&sup3;/day"
                  />
                )}

                <CalcResult
                  label="Storage Tank Size (1-day production)"
                  value={result.storageTankSize}
                  unit="m&sup3;"
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
          formula={`${data.formula}  |  ${data.sub_formulas.peak_day}  |  ${data.sub_formulas.peak_hour}`}
          inputs={[
            { label: data.variables.population.label, value: population, unit: data.variables.population.unit },
            { label: data.variables.perCapitaDemand.label, value: perCapitaDemand, unit: data.variables.perCapitaDemand.unit },
            { label: data.variables.nonRevenueFactor.label, value: nonRevenueFactor, unit: data.variables.nonRevenueFactor.unit },
            { label: data.variables.peakDayFactor.label, value: peakDayFactor, unit: data.variables.peakDayFactor.unit || "\u2014" },
            { label: data.variables.peakHourFactor.label, value: peakHourFactor, unit: data.variables.peakHourFactor.unit || "\u2014" },
            { label: data.variables.fireFlow.label, value: fireFlow, unit: data.variables.fireFlow.unit },
            { label: data.variables.commercialDemand.label, value: commercialDemand, unit: data.variables.commercialDemand.unit },
            { label: data.variables.industrialDemand.label, value: industrialDemand, unit: data.variables.industrialDemand.unit },
            { label: "Domestic Demand", value: result.domesticDemand.toFixed(2), unit: "m\u00B3/day" },
            { label: "Total Average Daily", value: result.totalAvgDaily.toFixed(2), unit: "m\u00B3/day" },
            { label: "NRW Allowance", value: result.nrwAllowance.toFixed(2), unit: "m\u00B3/day" },
            { label: "Production Demand", value: result.productionDemand.toFixed(2), unit: "m\u00B3/day" },
            { label: "Peak Day Demand", value: result.peakDayDemand.toFixed(2), unit: "m\u00B3/day" },
            { label: "Peak Hour Demand", value: result.peakHourDemand.toFixed(2), unit: "m\u00B3/day" },
            { label: "With Fire Flow", value: result.withFireFlow.toFixed(2), unit: "m\u00B3/day" },
            { label: "Storage Tank Size", value: result.storageTankSize.toFixed(2), unit: "m\u00B3" },
          ]}
          result={{
            label: data.result.productionDemand.label,
            value: result.productionDemand.toFixed(2),
            unit: data.result.productionDemand.unit,
          }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
