"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { crackWidthEC2 } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import KeyTerms from "@/components/KeyTerms";
import { keyTerms } from "@/data/key-terms";

const data = formulaData.crack_width;

const DISCLAIMER_TEXT =
  "This output is an engineering calculation aid only and does not constitute a final or endorsed design. All designs submitted to Malaysian authorities must be endorsed by a registered Professional Engineer (PE) under the Board of Engineers Malaysia (BEM) in accordance with the Registration of Engineers Act 1967.";

const wkLimitOptions = [
  { label: "0.3 mm — general (XC, XD, XS exposure)", value: "0.3" },
  { label: "0.2 mm — aggressive environment / prestress", value: "0.2" },
  { label: "0.4 mm — dry interior (XC1)", value: "0.4" },
];

const ktOptions = [
  { label: "0.4 — quasi-permanent (long-term)", value: "0.4" },
  { label: "0.6 — frequent (short-term)", value: "0.6" },
];

export default function CrackWidthPage() {
  const [b, setB] = useState("300");
  const [h, setH] = useState("500");
  const [d, setD] = useState("450");
  const [As, setAs] = useState("1570");
  const [phi, setPhi] = useState("20");
  const [cover, setCover] = useState("35");
  const [fck, setFck] = useState("30");
  const [Msls, setMsls] = useState("");
  const [kt, setKt] = useState("0.4");
  const [wkLimit, setWkLimit] = useState("0.3");

  const bVal = parseFloat(b);
  const hVal = parseFloat(h);
  const dVal = parseFloat(d);
  const AsVal = parseFloat(As);
  const phiVal = parseFloat(phi);
  const coverVal = parseFloat(cover);
  const fckVal = parseFloat(fck);
  const MslsVal = parseFloat(Msls);
  const ktVal = parseFloat(kt);
  const wkLimitVal = parseFloat(wkLimit);

  const { savedList, save, remove, clearAll, exportCalcs, importCalcs, isLoggedIn, syncing } = useCalcStorage("crack-width");

  const allValid =
    !isNaN(bVal) && bVal > 0 &&
    !isNaN(hVal) && hVal > 0 &&
    !isNaN(dVal) && dVal > 0 && dVal < hVal &&
    !isNaN(AsVal) && AsVal > 0 &&
    !isNaN(phiVal) && phiVal > 0 &&
    !isNaN(coverVal) && coverVal > 0 &&
    !isNaN(fckVal) && fckVal > 0 &&
    !isNaN(MslsVal) && MslsVal > 0 &&
    !isNaN(ktVal) && !isNaN(wkLimitVal);

  const result = allValid
    ? crackWidthEC2(bVal, hVal, dVal, AsVal, phiVal, coverVal, fckVal, MslsVal, ktVal, wkLimitVal)
    : null;

  return (
    <>
      <div className="print:hidden">
        <Breadcrumbs
          items={[
            { label: "Structural", href: "/calculators/concrete" },
            { label: "Crack Width Control" },
          ]}
        />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) =>
            save(name, { b, h, d, As, phi, cover, fck, Msls, kt, wkLimit })
          }
          onLoad={(v) => {
            setB(v.b ?? "300");
            setH(v.h ?? "500");
            setD(v.d ?? "450");
            setAs(v.As ?? "1570");
            setPhi(v.phi ?? "20");
            setCover(v.cover ?? "35");
            setFck(v.fck ?? "30");
            setMsls(v.Msls ?? "");
            setKt(v.kt ?? "0.4");
            setWkLimit(v.wkLimit ?? "0.3");
          }}
          onRemove={remove}
          onExport={exportCalcs}
          onImport={importCalcs}
          onReset={() => { setB("300"); setH("500"); setD("450"); setAs("1570"); setPhi("20"); setCover("35"); setFck("30"); setMsls(""); setKt("0.4"); setWkLimit("0.3"); }}
          isLoggedIn={isLoggedIn}
          syncing={syncing}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />

        <div className="rounded-2xl bg-stone-50 border border-stone-200 p-3 mb-6">
          <p className="text-sm text-stone-700">
            <strong>SLS crack control (EC2 Cl. 7.3.4):</strong> Cracked section analysis (elastic) for σs.
            k₁ = 0.8 (deformed bars), k₂ = 0.5 (bending), k₃ = 3.4, k₄ = 0.425.
            wmax = 0.3 mm for most Malaysian exposures (XC2–XS3).
          </p>
        </div>

        <KeyTerms terms={keyTerms["crack-width"].terms} standard={keyTerms["crack-width"].standard} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-3">Section Geometry</h3>
            <CalcInput name="b" label={data.variables.b.label} unit={data.variables.b.unit} hint={data.variables.b.hint} value={b} onChange={setB} min={0} />
            <CalcInput name="h" label={data.variables.h.label} unit={data.variables.h.unit} hint={data.variables.h.hint} value={h} onChange={setH} min={0} />
            <CalcInput name="d" label={data.variables.d.label} unit={data.variables.d.unit} hint={data.variables.d.hint} value={d} onChange={setD} min={0} />

            <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-3 mt-4">Reinforcement</h3>
            <CalcInput name="As" label={data.variables.As.label} unit={data.variables.As.unit} hint={data.variables.As.hint} value={As} onChange={setAs} min={0} />
            <CalcInput name="phi" label={data.variables.phi.label} unit={data.variables.phi.unit} hint={data.variables.phi.hint} value={phi} onChange={setPhi} min={0} />
            <CalcInput name="cover" label={data.variables.cover.label} unit={data.variables.cover.unit} hint={data.variables.cover.hint} value={cover} onChange={setCover} min={0} />

            <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-3 mt-4">Materials &amp; Loading</h3>
            <CalcInput name="fck" label={data.variables.fck.label} unit={data.variables.fck.unit} hint={data.variables.fck.hint} value={fck} onChange={setFck} min={0} />
            <CalcInput name="Msls" label={data.variables.Msls.label} unit={data.variables.Msls.unit} hint={data.variables.Msls.hint} value={Msls} onChange={setMsls} min={0} />

            <div className="mb-4">
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Load Duration (kt)
              </label>
              <select
                value={kt}
                onChange={(e) => setKt(e.target.value)}
                className="w-full rounded-2xl border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:border-amber-500 focus:ring-amber-500"
              >
                {ktOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Crack Width Limit wmax (EC2 Table 7.1N)
              </label>
              <select
                value={wkLimit}
                onChange={(e) => setWkLimit(e.target.value)}
                className="w-full rounded-2xl border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:border-amber-500 focus:ring-amber-500"
              >
                {wkLimitOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
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
                    { label: data.variables.b.label, value: b, unit: data.variables.b.unit },
                    { label: data.variables.h.label, value: h, unit: data.variables.h.unit },
                    { label: data.variables.d.label, value: d, unit: data.variables.d.unit },
                    { label: data.variables.As.label, value: As, unit: data.variables.As.unit },
                    { label: "Bar diameter φ", value: phi, unit: "mm" },
                    { label: "Cover c", value: cover, unit: "mm" },
                    { label: data.variables.fck.label, value: fck, unit: data.variables.fck.unit },
                    { label: "SLS Moment", value: Msls, unit: "kN·m" },
                    { label: "kt (load duration)", value: kt, unit: "" },
                    { label: "Neutral axis (cracked) x", value: result.xCracked.toFixed(1), unit: "mm" },
                    { label: "Steel stress σs", value: result.sigmaS.toFixed(1), unit: "MPa" },
                    { label: "ρp,eff", value: (result.rhoEff * 100).toFixed(3), unit: "%" },
                    { label: "sr,max", value: result.srMax.toFixed(1), unit: "mm" },
                    { label: "(εsm − εcm)", value: result.epsilonDiff.toFixed(6), unit: "" },
                  ],
                  result: {
                    label: `wk = ${result.wk.toFixed(4)} mm  ${result.pass ? "≤" : ">"} wmax = ${wkLimit} mm`,
                    value: result.wk.toFixed(4),
                    unit: "mm",
                  },
                  additionalResults: [
                    { label: "Utilisation wk/wmax", value: (result.utilisation * 100).toFixed(1), unit: "%" },
                    { label: "Status", value: result.pass ? "PASS" : "FAIL", unit: "" },
                  ],
                  disclaimer: DISCLAIMER_TEXT,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            {result ? (
              <>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">Cracked Section Analysis</h3>
                <CalcResult label="Ecm (secant modulus)" value={result.Ecm} unit="GPa" decimals={2} />
                <CalcResult label="fct,eff" value={result.fctEff} unit="MPa" decimals={2} />
                <CalcResult label="αe = Es/Ecm" value={result.alphaE} unit="" decimals={1} />
                <CalcResult label="Neutral axis depth x (cracked)" value={result.xCracked} unit="mm" decimals={1} />
                <CalcResult label="Lever arm z" value={result.z} unit="mm" decimals={1} />
                <CalcResult label="Steel stress σs" value={result.sigmaS} unit="MPa" decimals={1} />

                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 pt-2">Effective Tension Zone</h3>
                <CalcResult label="hc,ef" value={result.hcEff} unit="mm" decimals={1} />
                <CalcResult label="Ac,eff" value={result.AcEff} unit="mm²" decimals={0} />
                <CalcResult label="ρp,eff" value={result.rhoEff * 100} unit="%" decimals={3} />

                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 pt-2">Crack Width</h3>
                <CalcResult label="Max crack spacing sr,max" value={result.srMax} unit="mm" decimals={1} />
                <CalcResult label="Strain difference (εsm − εcm)" value={result.epsilonDiff} unit="" decimals={6} />
                <CalcResult label="Calculated wk" value={result.wk} unit="mm" decimals={4} />
                <CalcResult label="Limit wmax" value={result.wkLimit} unit="mm" decimals={2} />

                <div className={`rounded-2xl p-3 border ${result.pass ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                  <p className={`text-sm font-semibold ${result.pass ? "text-green-800" : "text-red-800"}`}>
                    {result.pass ? "PASS" : "FAIL"} — {(result.utilisation * 100).toFixed(1)}% utilisation
                  </p>
                  <p className={`text-xs mt-1 ${result.pass ? "text-green-700" : "text-red-700"}`}>
                    wk = {result.wk.toFixed(4)} mm {result.pass ? "≤" : ">"} wmax = {wkLimit} mm
                  </p>
                </div>
              </>
            ) : (
              <>
                <CalcResult label="Steel stress σs" value={null} unit="MPa" />
                <CalcResult label="Max crack spacing sr,max" value={null} unit="mm" />
                <CalcResult label="Calculated crack width wk" value={null} unit="mm" />
              </>
            )}
          </div>
        </div>

        <Disclaimer text={DISCLAIMER_TEXT} />
      </div>

      {allValid && result && (
        <PrintNote
          title={data.name}
          reference={data.reference}
          formula={data.formula}
          inputs={[
            { label: "b × h × d", value: `${b}×${h}×${d}`, unit: "mm" },
            { label: "As", value: As, unit: "mm²" },
            { label: "φ / cover", value: `${phi} / ${cover}`, unit: "mm" },
            { label: "fck", value: fck, unit: "MPa" },
            { label: "SLS Moment", value: Msls, unit: "kN·m" },
            { label: "kt", value: kt, unit: "" },
            { label: "σs", value: result.sigmaS.toFixed(1), unit: "MPa" },
            { label: "sr,max", value: result.srMax.toFixed(1), unit: "mm" },
          ]}
          result={{
            label: `wk = ${result.wk.toFixed(4)} mm  ${result.pass ? "≤" : ">"} wmax = ${wkLimit} mm`,
            value: result.wk.toFixed(4),
            unit: "mm",
          }}
          disclaimer={DISCLAIMER_TEXT}
        />
      )}
    </>
  );
}
