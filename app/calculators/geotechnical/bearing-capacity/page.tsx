"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { bearingCapacity } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import KeyTerms from "@/components/KeyTerms";
import { keyTerms } from "@/data/key-terms";

const data = (formulaData as Record<string, any>).bearing_capacity;

const methodOptions = [
  { value: "terzaghi", label: "Terzaghi (classical)" },
  { value: "meyerhof", label: "Meyerhof (with shape & depth factors)" },
];

export default function BearingCapacityPage() {
  const [method, setMethod] = useState("terzaghi");
  const [phi, setPhi] = useState("");
  const [c, setC] = useState("");
  const [gamma, setGamma] = useState("");
  const [Df, setDf] = useState("");
  const [B, setB] = useState("");
  const [L, setL] = useState("");
  const [FOS, setFOS] = useState("3");

  const phiVal = parseFloat(phi);
  const cVal = parseFloat(c);
  const gammaVal = parseFloat(gamma);
  const DfVal = parseFloat(Df);
  const BVal = parseFloat(B);
  const LVal = parseFloat(L);
  const FOSVal = parseFloat(FOS);

  const { savedList, save, remove, clearAll, exportCalcs, importCalcs, isLoggedIn, syncing } = useCalcStorage("bearing-capacity");

  const allValid =
    !isNaN(phiVal) && phiVal >= 0 &&
    !isNaN(cVal) && cVal >= 0 &&
    (cVal > 0 || phiVal > 0) &&
    !isNaN(gammaVal) && gammaVal > 0 &&
    !isNaN(DfVal) && DfVal >= 0 &&
    !isNaN(BVal) && BVal > 0 &&
    !isNaN(LVal) && LVal >= 0 &&
    !isNaN(FOSVal) && FOSVal > 0;

  const result = allValid
    ? bearingCapacity(method as "terzaghi" | "meyerhof", phiVal, cVal, gammaVal, DfVal, BVal, LVal, FOSVal)
    : null;

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: "Geotechnical", href: "/calculators/geotechnical" }, { label: "Bearing Capacity" }]} />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { method, phi, c, gamma, Df, B, L, FOS })}
          onLoad={(v) => {
            setMethod(v.method ?? "terzaghi");
            setPhi(v.phi ?? "");
            setC(v.c ?? "");
            setGamma(v.gamma ?? "");
            setDf(v.Df ?? "");
            setB(v.B ?? "");
            setL(v.L ?? "");
            setFOS(v.FOS ?? "3");
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

        <KeyTerms terms={keyTerms["bearing-capacity"].terms} standard={keyTerms["bearing-capacity"].standard} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">Method</h3>
            <div className="mb-4">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 focus:border-amber-500 focus:ring-amber-500"
              >
                {methodOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <h3 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">Soil Properties</h3>
            <CalcInput name="phi" label={data.variables.phi.label} unit={data.variables.phi.unit} hint={data.variables.phi.hint} value={phi} onChange={setPhi} min={0} />
            <CalcInput name="c" label={data.variables.c.label} unit={data.variables.c.unit} hint={data.variables.c.hint} value={c} onChange={setC} min={0} />
            <CalcInput name="gamma" label={data.variables.gamma.label} unit={data.variables.gamma.unit} hint={data.variables.gamma.hint} value={gamma} onChange={setGamma} min={0} />

            <h3 className="text-sm font-semibold text-stone-600 mb-2 mt-6 uppercase tracking-wide">Foundation Geometry</h3>
            <CalcInput name="Df" label={data.variables.Df.label} unit={data.variables.Df.unit} hint={data.variables.Df.hint} value={Df} onChange={setDf} min={0} />
            <CalcInput name="B" label={data.variables.B.label} unit={data.variables.B.unit} hint={data.variables.B.hint} value={B} onChange={setB} min={0} />
            <CalcInput name="L" label={data.variables.L.label} unit={data.variables.L.unit} hint={data.variables.L.hint} value={L} onChange={setL} min={0} />

            <h3 className="text-sm font-semibold text-stone-600 mb-2 mt-6 uppercase tracking-wide">Design</h3>
            <CalcInput name="FOS" label={data.variables.FOS.label} unit={data.variables.FOS.unit} hint={data.variables.FOS.hint} value={FOS} onChange={setFOS} min={0} />

            {allValid && result && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: data.formula,
                  inputs: [
                    { label: "Method", value: methodOptions.find(o => o.value === method)?.label ?? method, unit: "" },
                    { label: data.variables.phi.label, value: phi, unit: data.variables.phi.unit },
                    { label: data.variables.c.label, value: c, unit: data.variables.c.unit },
                    { label: data.variables.gamma.label, value: gamma, unit: data.variables.gamma.unit },
                    { label: data.variables.Df.label, value: Df, unit: data.variables.Df.unit },
                    { label: data.variables.B.label, value: B, unit: data.variables.B.unit },
                    { label: data.variables.L.label, value: L, unit: data.variables.L.unit },
                    { label: data.variables.FOS.label, value: FOS, unit: "" },
                  ],
                  result: {
                    label: "Allowable Bearing Capacity",
                    value: result.qAllowable.toFixed(1),
                    unit: "kPa",
                  },
                  additionalResults: [
                    { label: "Ultimate Bearing Capacity (qu)", value: result.qu.toFixed(1), unit: "kPa" },
                    { label: "Net Allowable (qNet)", value: result.qNet.toFixed(1), unit: "kPa" },
                    { label: "Surcharge (q)", value: result.surcharge.toFixed(1), unit: "kPa" },
                  ],
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            {result ? (
              <>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">Bearing Capacity Factors</h3>
                <CalcResult label="Nc" value={result.Nc} unit="" />
                <CalcResult label="Nq" value={result.Nq} unit="" />
                <CalcResult label="Ngamma" value={result.Ngamma} unit="" />

                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 pt-2">Results</h3>
                <CalcResult label="Surcharge (q = gamma x Df)" value={result.surcharge} unit="kPa" />
                <CalcResult label={data.result.qu.label} value={result.qu} unit={data.result.qu.unit} />
                <CalcResult label={data.result.qAllowable.label} value={result.qAllowable} unit={data.result.qAllowable.unit} />
                <CalcResult label="Net Allowable Bearing (qNet)" value={result.qNet} unit="kPa" />
              </>
            ) : (
              <>
                <CalcResult label="Ultimate Bearing Capacity (qu)" value={null} unit="kPa" />
                <CalcResult label="Allowable Bearing Capacity" value={null} unit="kPa" />
                <CalcResult label="Net Allowable Bearing" value={null} unit="kPa" />
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
            { label: "Method", value: methodOptions.find(o => o.value === method)?.label ?? method, unit: "" },
            { label: data.variables.phi.label, value: phi, unit: data.variables.phi.unit },
            { label: data.variables.c.label, value: c, unit: data.variables.c.unit },
            { label: data.variables.gamma.label, value: gamma, unit: data.variables.gamma.unit },
            { label: data.variables.Df.label, value: Df, unit: data.variables.Df.unit },
            { label: "Footing B x L", value: `${B} x ${L}`, unit: "m" },
            { label: data.variables.FOS.label, value: FOS, unit: "" },
          ]}
          result={{ label: "Allowable Bearing Capacity", value: result.qAllowable.toFixed(1), unit: "kPa" }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
