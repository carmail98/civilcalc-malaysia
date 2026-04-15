"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { settlementCalc } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import KeyTerms from "@/components/KeyTerms";
import { keyTerms } from "@/data/key-terms";

const data = (formulaData as Record<string, any>).settlement_calc;

export default function SettlementPage() {
  const [Cc, setCc] = useState("");
  const [Cs, setCs] = useState("");
  const [e0, setE0] = useState("");
  const [H, setH] = useState("");
  const [sigma0, setSigma0] = useState("");
  const [deltaSigma, setDeltaSigma] = useState("");
  const [sigmaP, setSigmaP] = useState("");
  const [Cv, setCv] = useState("");
  const [drainagePath, setDrainagePath] = useState("");

  const CcVal = parseFloat(Cc);
  const CsVal = parseFloat(Cs);
  const e0Val = parseFloat(e0);
  const HVal = parseFloat(H);
  const sigma0Val = parseFloat(sigma0);
  const deltaSigmaVal = parseFloat(deltaSigma);
  const sigmaPVal = parseFloat(sigmaP);
  const CvVal = parseFloat(Cv);
  const drainagePathVal = parseFloat(drainagePath);

  const { savedList, save, remove, clearAll, exportCalcs, importCalcs, isLoggedIn, syncing } = useCalcStorage("settlement-calc");

  const allValid =
    !isNaN(CcVal) && CcVal > 0 &&
    !isNaN(CsVal) && CsVal > 0 &&
    !isNaN(e0Val) && e0Val > 0 &&
    !isNaN(HVal) && HVal > 0 &&
    !isNaN(sigma0Val) && sigma0Val > 0 &&
    !isNaN(deltaSigmaVal) && deltaSigmaVal > 0 &&
    !isNaN(sigmaPVal) && sigmaPVal > 0 &&
    !isNaN(CvVal) && CvVal > 0 &&
    !isNaN(drainagePathVal) && drainagePathVal > 0;

  const result = allValid
    ? settlementCalc(CcVal, CsVal, e0Val, HVal, sigma0Val, deltaSigmaVal, sigmaPVal, CvVal, drainagePathVal)
    : null;

  const soilStateColor = result
    ? result.soilState === "Over-consolidated"
      ? "border-green-200 bg-green-50 text-green-800"
      : result.soilState === "Normally consolidated"
      ? "border-sky-200 bg-sky-50 text-sky-800"
      : "border-red-200 bg-red-50 text-red-800"
    : "";

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: "Geotechnical", href: "/calculators/geotechnical" }, { label: "Settlement Calculation" }]} />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { Cc, Cs, e0, H, sigma0, deltaSigma, sigmaP, Cv, drainagePath })}
          onLoad={(v) => {
            setCc(v.Cc ?? "");
            setCs(v.Cs ?? "");
            setE0(v.e0 ?? "");
            setH(v.H ?? "");
            setSigma0(v.sigma0 ?? "");
            setDeltaSigma(v.deltaSigma ?? "");
            setSigmaP(v.sigmaP ?? "");
            setCv(v.Cv ?? "");
            setDrainagePath(v.drainagePath ?? "");
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

        <KeyTerms terms={keyTerms["settlement-calc"].terms} standard={keyTerms["settlement-calc"].standard} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">Soil Properties</h3>
            <CalcInput name="Cc" label={data.variables.Cc.label} unit={data.variables.Cc.unit} hint={data.variables.Cc.hint} value={Cc} onChange={setCc} min={0} />
            <CalcInput name="Cs" label={data.variables.Cs.label} unit={data.variables.Cs.unit} hint={data.variables.Cs.hint} value={Cs} onChange={setCs} min={0} />
            <CalcInput name="e0" label={data.variables.e0.label} unit={data.variables.e0.unit} hint={data.variables.e0.hint} value={e0} onChange={setE0} min={0} />
            <CalcInput name="H" label={data.variables.H.label} unit={data.variables.H.unit} hint={data.variables.H.hint} value={H} onChange={setH} min={0} />

            <h3 className="text-sm font-semibold text-stone-600 mb-2 mt-6 uppercase tracking-wide">Stress Parameters</h3>
            <CalcInput name="sigma0" label={data.variables.sigma0.label} unit={data.variables.sigma0.unit} hint={data.variables.sigma0.hint} value={sigma0} onChange={setSigma0} min={0} />
            <CalcInput name="deltaSigma" label={data.variables.deltaSigma.label} unit={data.variables.deltaSigma.unit} hint={data.variables.deltaSigma.hint} value={deltaSigma} onChange={setDeltaSigma} min={0} />
            <CalcInput name="sigmaP" label={data.variables.sigmaP.label} unit={data.variables.sigmaP.unit} hint={data.variables.sigmaP.hint} value={sigmaP} onChange={setSigmaP} min={0} />

            <h3 className="text-sm font-semibold text-stone-600 mb-2 mt-6 uppercase tracking-wide">Consolidation</h3>
            <CalcInput name="Cv" label={data.variables.Cv.label} unit={data.variables.Cv.unit} hint={data.variables.Cv.hint} value={Cv} onChange={setCv} min={0} />
            <CalcInput name="drainagePath" label={data.variables.drainagePath.label} unit={data.variables.drainagePath.unit} hint={data.variables.drainagePath.hint} value={drainagePath} onChange={setDrainagePath} min={0} />

            {allValid && result && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: data.formula,
                  inputs: [
                    { label: data.variables.Cc.label, value: Cc, unit: "" },
                    { label: data.variables.Cs.label, value: Cs, unit: "" },
                    { label: data.variables.e0.label, value: e0, unit: "" },
                    { label: data.variables.H.label, value: H, unit: "m" },
                    { label: data.variables.sigma0.label, value: sigma0, unit: "kPa" },
                    { label: data.variables.deltaSigma.label, value: deltaSigma, unit: "kPa" },
                    { label: data.variables.sigmaP.label, value: sigmaP, unit: "kPa" },
                    { label: data.variables.Cv.label, value: Cv, unit: "m\u00B2/year" },
                    { label: data.variables.drainagePath.label, value: drainagePath, unit: "m" },
                  ],
                  result: {
                    label: "Total Settlement (Sc)",
                    value: result.Sc.toFixed(1),
                    unit: "mm",
                  },
                  additionalResults: [
                    { label: "OCR", value: result.OCR.toFixed(2), unit: "" },
                    { label: "Soil State", value: result.soilState, unit: "" },
                    { label: "t50", value: result.t50.toFixed(2), unit: "years" },
                    { label: "t90", value: result.t90.toFixed(2), unit: "years" },
                  ],
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            {result ? (
              <>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">Consolidation State</h3>
                <CalcResult label="OCR (Over-Consolidation Ratio)" value={result.OCR} unit="" />
                <div className={`rounded-2xl border p-3 text-sm font-medium ${soilStateColor}`}>
                  {result.soilState} (OCR = {result.OCR.toFixed(2)})
                </div>

                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 pt-2">Settlement</h3>
                <CalcResult label={data.result.Sc.label} value={result.Sc} unit={data.result.Sc.unit} />

                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 pt-2">Time for Consolidation</h3>
                <CalcResult label="Time for 50% consolidation (t50)" value={result.t50} unit="years" />
                <CalcResult label="Time for 90% consolidation (t90)" value={result.t90} unit="years" />
              </>
            ) : (
              <>
                <CalcResult label="OCR" value={null} unit="" />
                <CalcResult label="Total Settlement (Sc)" value={null} unit="mm" />
                <CalcResult label="t50" value={null} unit="years" />
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
            { label: data.variables.Cc.label, value: Cc, unit: "" },
            { label: data.variables.Cs.label, value: Cs, unit: "" },
            { label: data.variables.e0.label, value: e0, unit: "" },
            { label: data.variables.H.label, value: H, unit: "m" },
            { label: data.variables.sigma0.label, value: sigma0, unit: "kPa" },
            { label: data.variables.deltaSigma.label, value: deltaSigma, unit: "kPa" },
            { label: data.variables.sigmaP.label, value: sigmaP, unit: "kPa" },
            { label: data.variables.Cv.label, value: Cv, unit: "m\u00B2/year" },
            { label: data.variables.drainagePath.label, value: drainagePath, unit: "m" },
          ]}
          result={{ label: `Settlement = ${result.Sc.toFixed(1)} mm | ${result.soilState} | OCR = ${result.OCR.toFixed(2)}`, value: result.Sc.toFixed(1), unit: "mm" }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
