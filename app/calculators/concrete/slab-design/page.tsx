"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { rcSlabDesign } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import KeyTerms from "@/components/KeyTerms";
import { keyTerms } from "@/data/key-terms";

const data = (formulaData as Record<string, any>).slab_design;

const supportOptions = [
  { value: "simply_supported", label: "Simply supported (4 edges)" },
  { value: "one_long_edge", label: "One long edge continuous" },
  { value: "two_adjacent", label: "Two adjacent edges continuous" },
  { value: "two_short", label: "Two short edges continuous" },
  { value: "two_long", label: "Two long edges continuous" },
  { value: "three_edges", label: "Three edges continuous" },
  { value: "four_edges", label: "Four edges continuous" },
  { value: "cantilever", label: "Cantilever" },
];

export default function SlabDesignPage() {
  const [lx, setLx] = useState("");
  const [ly, setLy] = useState("");
  const [h, setH] = useState("");
  const [cover, setCover] = useState("25");
  const [barDia, setBarDia] = useState("10");
  const [fck, setFck] = useState("30");
  const [fyk, setFyk] = useState("500");
  const [Gk, setGk] = useState("");
  const [Qk, setQk] = useState("");
  const [support, setSupport] = useState("simply_supported");

  const lxVal = parseFloat(lx);
  const lyVal = parseFloat(ly);
  const hVal = parseFloat(h);
  const coverVal = parseFloat(cover);
  const barDiaVal = parseFloat(barDia);
  const fckVal = parseFloat(fck);
  const fykVal = parseFloat(fyk);
  const GkVal = parseFloat(Gk);
  const QkVal = parseFloat(Qk);

  const { savedList, save, remove, clearAll, exportCalcs, importCalcs, isLoggedIn, syncing } = useCalcStorage("slab-design");

  const allValid =
    !isNaN(lxVal) && lxVal > 0 &&
    !isNaN(lyVal) && lyVal > 0 &&
    !isNaN(hVal) && hVal > 0 &&
    !isNaN(coverVal) && coverVal > 0 &&
    !isNaN(barDiaVal) && barDiaVal > 0 &&
    !isNaN(fckVal) && fckVal > 0 &&
    !isNaN(fykVal) && fykVal > 0 &&
    !isNaN(GkVal) && GkVal > 0 &&
    !isNaN(QkVal) && QkVal >= 0;

  const result = allValid
    ? rcSlabDesign(lxVal, lyVal, hVal, coverVal, barDiaVal, fckVal, fykVal, GkVal, QkVal, support as any)
    : null;

  return (
    <>
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: "Structural", href: "/calculators/concrete" }, { label: "Slab Design" }]} />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { lx, ly, h, cover, barDia, fck, fyk, Gk, Qk, support })}
          onLoad={(v) => { setLx(v.lx ?? ""); setLy(v.ly ?? ""); setH(v.h ?? ""); setCover(v.cover ?? "25"); setBarDia(v.barDia ?? "10"); setFck(v.fck ?? "30"); setFyk(v.fyk ?? "500"); setGk(v.Gk ?? ""); setQk(v.Qk ?? ""); setSupport(v.support ?? "simply_supported"); }}
          onRemove={remove}
          onExport={exportCalcs}
          onImport={importCalcs}
          isLoggedIn={isLoggedIn}
          syncing={syncing}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />

        <div className="grid gap-2 md:grid-cols-3 mb-6">
          {Object.entries(data.sub_formulas as Record<string, string>).map(([key, formula]) => (
            <div key={key} className="rounded-2xl bg-stone-50 border border-stone-200 p-3">
              <p className="text-sm font-mono text-stone-700">{formula}</p>
            </div>
          ))}
        </div>

        <KeyTerms terms={keyTerms["slab-design"].terms} standard={keyTerms["slab-design"].standard} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">Span & Geometry</h3>
            <CalcInput name="lx" label={data.variables.lx.label} unit={data.variables.lx.unit} hint={data.variables.lx.hint} value={lx} onChange={setLx} min={0} />
            <CalcInput name="ly" label={data.variables.ly.label} unit={data.variables.ly.unit} hint={data.variables.ly.hint} value={ly} onChange={setLy} min={0} />
            <CalcInput name="h" label={data.variables.h.label} unit={data.variables.h.unit} hint={data.variables.h.hint} value={h} onChange={setH} min={0} />
            <CalcInput name="cover" label={data.variables.cover.label} unit={data.variables.cover.unit} hint={data.variables.cover.hint} value={cover} onChange={setCover} min={0} />
            <CalcInput name="barDia" label={data.variables.barDia.label} unit={data.variables.barDia.unit} hint={data.variables.barDia.hint} value={barDia} onChange={setBarDia} min={0} />

            <h3 className="text-sm font-semibold text-stone-600 mb-2 mt-6 uppercase tracking-wide">Material</h3>
            <CalcInput name="fck" label={data.variables.fck.label} unit={data.variables.fck.unit} hint={data.variables.fck.hint} value={fck} onChange={setFck} min={0} />
            <CalcInput name="fyk" label={data.variables.fyk.label} unit={data.variables.fyk.unit} hint={data.variables.fyk.hint} value={fyk} onChange={setFyk} min={0} />

            <h3 className="text-sm font-semibold text-stone-600 mb-2 mt-6 uppercase tracking-wide">Loading</h3>
            <CalcInput name="Gk" label={data.variables.Gk.label} unit={data.variables.Gk.unit} hint={data.variables.Gk.hint} value={Gk} onChange={setGk} min={0} />
            <CalcInput name="Qk" label={data.variables.Qk.label} unit={data.variables.Qk.unit} hint={data.variables.Qk.hint} value={Qk} onChange={setQk} min={0} />

            <h3 className="text-sm font-semibold text-stone-600 mb-2 mt-6 uppercase tracking-wide">Support Condition</h3>
            <div className="mb-4">
              <select
                value={support}
                onChange={(e) => setSupport(e.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 focus:border-amber-500 focus:ring-amber-500"
              >
                {supportOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {allValid && result && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: data.formula,
                  inputs: [
                    { label: "Short Span (lx)", value: lx, unit: "m" },
                    { label: "Long Span (ly)", value: ly, unit: "m" },
                    { label: "Slab Thickness", value: h, unit: "mm" },
                    { label: "Cover", value: cover, unit: "mm" },
                    { label: "Bar Diameter", value: barDia, unit: "mm" },
                    { label: "fck", value: fck, unit: "MPa" },
                    { label: "Gk", value: Gk, unit: "kN/m²" },
                    { label: "Qk", value: Qk, unit: "kN/m²" },
                    { label: "Support", value: supportOptions.find(o => o.value === support)?.label ?? support, unit: "" },
                    { label: "Span Type", value: result.spanType, unit: "" },
                  ],
                  result: {
                    label: "Steel Required (Short Span)",
                    value: result.AsxReq.toFixed(0),
                    unit: "mm²/m",
                  },
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            {result && (
              <>
                <div className={`rounded-2xl border p-3 text-sm font-medium ${result.spanType === "two-way" ? "border-sky-200 bg-sky-50 text-sky-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
                  ly/lx = {result.ratio.toFixed(2)} → <strong>{result.spanType === "two-way" ? "Two-Way Slab" : "One-Way Slab"}</strong>
                </div>
                <CalcResult label="ULS Load (n)" value={result.nUls} unit="kN/m²" />
                <CalcResult label="Effective Depth (d)" value={result.dEff} unit="mm" decimals={1} />
                <CalcResult label="βsx (short span coeff)" value={result.bsx} unit="" decimals={4} />
                <CalcResult label="Moment Msx (short span)" value={result.Msx} unit="kN·m/m" />
                <CalcResult label={data.result.AsxReq.label} value={result.AsxReq} unit={data.result.AsxReq.unit} decimals={0} />
                {result.spanType === "two-way" && (
                  <>
                    <CalcResult label="βsy (long span coeff)" value={result.bsy} unit="" decimals={4} />
                    <CalcResult label="Moment Msy (long span)" value={result.Msy} unit="kN·m/m" />
                    <CalcResult label={data.result.AsyReq.label} value={result.AsyReq} unit={data.result.AsyReq.unit} decimals={0} />
                  </>
                )}
                <CalcResult label="Minimum Steel (As,min)" value={result.AsMin} unit="mm²/m" decimals={0} />
                <div className={`rounded-2xl border p-3 text-sm font-medium ${result.deflectionOk ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-800"}`}>
                  Deflection: l/d = {result.spanToDepthActual.toFixed(1)} {result.deflectionOk ? "≤" : ">"} {result.spanToDepthLimit.toFixed(1)} — <strong>{result.deflectionOk ? "OK" : "FAIL"}</strong>
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
            { label: "Short Span (lx)", value: lx, unit: "m" },
            { label: "Long Span (ly)", value: ly, unit: "m" },
            { label: "Slab Thickness", value: h, unit: "mm" },
            { label: "fck", value: fck, unit: "MPa" },
            { label: "Gk", value: Gk, unit: "kN/m²" },
            { label: "Qk", value: Qk, unit: "kN/m²" },
            { label: "Support", value: supportOptions.find(o => o.value === support)?.label ?? support, unit: "" },
          ]}
          result={{ label: "Steel Required (Short)", value: result.AsxReq.toFixed(0), unit: "mm²/m" }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
