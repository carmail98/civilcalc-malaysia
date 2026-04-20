"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { deflectionCheckEC2 } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import KeyTerms from "@/components/KeyTerms";
import { keyTerms } from "@/data/key-terms";

const data = (formulaData as Record<string, any>).deflection_check;

const supportOptions = [
  { value: "simply_supported", label: "Simply supported" },
  { value: "continuous_end", label: "End span (continuous)" },
  { value: "continuous_interior", label: "Interior span (continuous)" },
  { value: "cantilever", label: "Cantilever" },
];

export default function DeflectionCheckPage() {
  const [lSpan, setLSpan] = useState("");
  const [dEff, setDEff] = useState("");
  const [b, setB] = useState("1000");
  const [AsReq, setAsReq] = useState("");
  const [AsProv, setAsProv] = useState("");
  const [fck, setFck] = useState("30");
  const [fyk, setFyk] = useState("500");
  const [supportType, setSupportType] = useState("simply_supported");
  const [isFlange, setIsFlange] = useState(false);

  const lSpanVal = parseFloat(lSpan);
  const dEffVal = parseFloat(dEff);
  const bVal = parseFloat(b);
  const AsReqVal = parseFloat(AsReq);
  const AsProvVal = parseFloat(AsProv);
  const fckVal = parseFloat(fck);
  const fykVal = parseFloat(fyk);

  const { savedList, save, remove, clearAll, exportCalcs, importCalcs, isLoggedIn, syncing } = useCalcStorage("deflection-check");

  const allValid =
    !isNaN(lSpanVal) && lSpanVal > 0 &&
    !isNaN(dEffVal) && dEffVal > 0 &&
    !isNaN(bVal) && bVal > 0 &&
    !isNaN(AsReqVal) && AsReqVal > 0 &&
    !isNaN(AsProvVal) && AsProvVal > 0 &&
    !isNaN(fckVal) && fckVal > 0 &&
    !isNaN(fykVal) && fykVal > 0;

  const result = allValid
    ? deflectionCheckEC2(lSpanVal, dEffVal, bVal, AsReqVal, AsProvVal, fckVal, fykVal, supportType as any, isFlange)
    : null;

  return (
    <>
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: "Structural", href: "/calculators/concrete" }, { label: "Deflection Check" }]} />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { lSpan, dEff, b, AsReq, AsProv, fck, fyk, supportType, isFlange: String(isFlange) })}
          onLoad={(v) => { setLSpan(v.lSpan ?? ""); setDEff(v.dEff ?? ""); setB(v.b ?? "1000"); setAsReq(v.AsReq ?? ""); setAsProv(v.AsProv ?? ""); setFck(v.fck ?? "30"); setFyk(v.fyk ?? "500"); setSupportType(v.supportType ?? "simply_supported"); setIsFlange(v.isFlange === "true"); }}
          onRemove={remove}
          onExport={exportCalcs}
          onImport={importCalcs}
          onReset={() => { setLSpan(""); setDEff(""); setB("1000"); setAsReq(""); setAsProv(""); setFck("30"); setFyk("500"); setSupportType("simply_supported"); setIsFlange(false); }}
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

        <KeyTerms terms={keyTerms["deflection-check"].terms} standard={keyTerms["deflection-check"].standard} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">Member Geometry</h3>
            <CalcInput name="lSpan" label={data.variables.lSpan.label} unit={data.variables.lSpan.unit} hint={data.variables.lSpan.hint} value={lSpan} onChange={setLSpan} min={0} />
            <CalcInput name="dEff" label={data.variables.dEff.label} unit={data.variables.dEff.unit} hint={data.variables.dEff.hint} value={dEff} onChange={setDEff} min={0} />
            <CalcInput name="b" label={data.variables.b.label} unit={data.variables.b.unit} hint={data.variables.b.hint} value={b} onChange={setB} min={0} />

            <h3 className="text-sm font-semibold text-stone-600 mb-2 mt-6 uppercase tracking-wide">Reinforcement</h3>
            <CalcInput name="AsReq" label={data.variables.AsReq.label} unit={data.variables.AsReq.unit} hint={data.variables.AsReq.hint} value={AsReq} onChange={setAsReq} min={0} />
            <CalcInput name="AsProv" label={data.variables.AsProv.label} unit={data.variables.AsProv.unit} hint={data.variables.AsProv.hint} value={AsProv} onChange={setAsProv} min={0} />

            <h3 className="text-sm font-semibold text-stone-600 mb-2 mt-6 uppercase tracking-wide">Material & Support</h3>
            <CalcInput name="fck" label={data.variables.fck.label} unit={data.variables.fck.unit} hint={data.variables.fck.hint} value={fck} onChange={setFck} min={0} />
            <CalcInput name="fyk" label={data.variables.fyk.label} unit={data.variables.fyk.unit} hint={data.variables.fyk.hint} value={fyk} onChange={setFyk} min={0} />

            <div className="mb-4">
              <label className="block text-sm font-medium text-stone-700 mb-1">Support Type</label>
              <select value={supportType} onChange={(e) => setSupportType(e.target.value)} className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 focus:border-amber-500 focus:ring-amber-500">
                {supportOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm text-stone-700">
                <input type="checkbox" checked={isFlange} onChange={(e) => setIsFlange(e.target.checked)} className="rounded border-stone-300" />
                Flanged section (T/L beam) — apply 0.8 factor
              </label>
            </div>

            {allValid && result && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: data.formula,
                  inputs: [
                    { label: "Span", value: lSpan, unit: "mm" },
                    { label: "Effective Depth", value: dEff, unit: "mm" },
                    { label: "Width", value: b, unit: "mm" },
                    { label: "As,req", value: AsReq, unit: "mm²" },
                    { label: "As,prov", value: AsProv, unit: "mm²" },
                    { label: "fck", value: fck, unit: "MPa" },
                    { label: "Support", value: supportOptions.find(o => o.value === supportType)?.label ?? supportType, unit: "" },
                  ],
                  result: { label: "Status", value: result.pass ? "PASS" : "FAIL", unit: `(${(result.utilisation * 100).toFixed(1)}%)` },
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            {result && (
              <>
                <CalcResult label="K Factor" value={result.K} unit="" />
                <CalcResult label="ρ (reinforcement ratio)" value={result.rho * 100} unit="%" decimals={3} />
                <CalcResult label="ρ₀ (reference ratio)" value={result.rho0 * 100} unit="%" decimals={3} />
                <CalcResult label="Basic l/d Ratio" value={result.basicRatio} unit="" />
                <CalcResult label="Modification Factor" value={result.modFactor} unit="" />
                <CalcResult label="As,prov/As,req Factor" value={result.asProvFactor} unit="" />
                <CalcResult label={data.result.limitingRatio.label} value={result.limitingRatio} unit="" />
                <CalcResult label={data.result.actualRatio.label} value={result.actualRatio} unit="" />
                <div className={`rounded-2xl border p-4 text-center ${result.pass ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                  <p className={`text-lg font-bold ${result.pass ? "text-green-700" : "text-red-700"}`}>
                    {result.pass ? "PASS" : "FAIL"}
                  </p>
                  <p className="text-sm text-stone-600 mt-1">
                    Utilisation: {(result.utilisation * 100).toFixed(1)}%
                  </p>
                </div>
              </>
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
            { label: "Span", value: lSpan, unit: "mm" },
            { label: "Effective Depth", value: dEff, unit: "mm" },
            { label: "As,req", value: AsReq, unit: "mm²" },
            { label: "As,prov", value: AsProv, unit: "mm²" },
            { label: "fck", value: fck, unit: "MPa" },
          ]}
          result={{ label: "Status", value: result.pass ? "PASS" : "FAIL", unit: `(${(result.utilisation * 100).toFixed(1)}%)` }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
