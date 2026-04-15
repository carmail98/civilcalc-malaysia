"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { rcBeamShear } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import KeyTerms from "@/components/KeyTerms";
import { keyTerms } from "@/data/key-terms";

const data = formulaData.rc_beam_shear;

const DISCLAIMER_TEXT =
  "This output is an engineering calculation aid only and does not constitute a final or endorsed design. All designs submitted to Malaysian authorities must be endorsed by a registered Professional Engineer (PE) under the Board of Engineers Malaysia (BEM) in accordance with the Registration of Engineers Act 1967.";

export default function BeamShearPage() {
  const [bw, setBw] = useState("300");
  const [d, setD] = useState("450");
  const [Asl, setAsl] = useState("1570");
  const [fck, setFck] = useState("30");
  const [fyk, setFyk] = useState("500");
  const [VEd, setVEd] = useState("");
  const [AswProvided, setAswProvided] = useState("");
  const [sProvided, setSProvided] = useState("");

  const bwVal = parseFloat(bw);
  const dVal = parseFloat(d);
  const AslVal = parseFloat(Asl);
  const fckVal = parseFloat(fck);
  const fykVal = parseFloat(fyk);
  const VEdVal = parseFloat(VEd);
  const AswVal = parseFloat(AswProvided);
  const sVal = parseFloat(sProvided);

  const { savedList, save, remove, clearAll, exportCalcs, importCalcs, isLoggedIn, syncing } = useCalcStorage("beam-shear");

  const allValid =
    !isNaN(bwVal) && bwVal > 0 &&
    !isNaN(dVal) && dVal > 0 &&
    !isNaN(AslVal) && AslVal > 0 &&
    !isNaN(fckVal) && fckVal > 0 &&
    !isNaN(fykVal) && fykVal > 0 &&
    !isNaN(VEdVal) && VEdVal > 0;

  const result = allValid
    ? rcBeamShear(
        bwVal, dVal, AslVal, fckVal, fykVal, VEdVal,
        !isNaN(AswVal) && AswVal > 0 ? AswVal : undefined,
        !isNaN(sVal) && sVal > 0 ? sVal : undefined
      )
    : null;

  const hasLinks = !isNaN(AswVal) && AswVal > 0 && !isNaN(sVal) && sVal > 0;

  return (
    <>
      <div className="print:hidden">
        <Breadcrumbs
          items={[
            { label: "Structural", href: "/calculators/concrete" },
            { label: "Beam Shear Design" },
          ]}
        />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) =>
            save(name, { bw, d, Asl, fck, fyk, VEd, AswProvided, sProvided })
          }
          onLoad={(v) => {
            setBw(v.bw ?? "300");
            setD(v.d ?? "450");
            setAsl(v.Asl ?? "1570");
            setFck(v.fck ?? "30");
            setFyk(v.fyk ?? "500");
            setVEd(v.VEd ?? "");
            setAswProvided(v.AswProvided ?? "");
            setSProvided(v.sProvided ?? "");
          }}
          onRemove={remove}
          onExport={exportCalcs}
          onImport={importCalcs}
          isLoggedIn={isLoggedIn}
          syncing={syncing}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />

        {/* EC2 method note */}
        <div className="rounded-2xl bg-stone-50 border border-stone-200 p-3 mb-6">
          <p className="text-sm text-stone-700">
            <strong>Variable Angle Truss Model (EC2 Cl. 6.2.3):</strong> cot θ optimised in range 1.0–2.5.
            γc = 1.5, γs = 1.15, αcc = 0.85, ν₁ = 0.6(1 − fck/250).
          </p>
          <p className="text-xs text-stone-500 mt-1">
            Critical section at d from face of support. VRd,c checked first; if VEd &gt; VRd,c, shear links are required.
          </p>
        </div>

        <KeyTerms terms={keyTerms["beam-shear"].terms} standard={keyTerms["beam-shear"].standard} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-3">Section Geometry</h3>
            <CalcInput name="bw" label={data.variables.bw.label} unit={data.variables.bw.unit} hint={data.variables.bw.hint} value={bw} onChange={setBw} min={0} />
            <CalcInput name="d" label={data.variables.d.label} unit={data.variables.d.unit} hint={data.variables.d.hint} value={d} onChange={setD} min={0} />
            <CalcInput name="Asl" label={data.variables.Asl.label} unit={data.variables.Asl.unit} hint={data.variables.Asl.hint} value={Asl} onChange={setAsl} min={0} />

            <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-3 mt-4">Materials &amp; Loading</h3>
            <CalcInput name="fck" label={data.variables.fck.label} unit={data.variables.fck.unit} hint={data.variables.fck.hint} value={fck} onChange={setFck} min={0} />
            <CalcInput name="fyk" label={data.variables.fyk.label} unit={data.variables.fyk.unit} hint={data.variables.fyk.hint} value={fyk} onChange={setFyk} min={0} />
            <CalcInput name="VEd" label={data.variables.VEd.label} unit={data.variables.VEd.unit} hint={data.variables.VEd.hint} value={VEd} onChange={setVEd} min={0} />

            <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-3 mt-4">Links Provided (optional)</h3>
            <CalcInput name="AswProvided" label={data.variables.AswProvided.label} unit={data.variables.AswProvided.unit} hint={data.variables.AswProvided.hint} value={AswProvided} onChange={setAswProvided} min={0} />
            <CalcInput name="sProvided" label={data.variables.sProvided.label} unit={data.variables.sProvided.unit} hint={data.variables.sProvided.hint} value={sProvided} onChange={setSProvided} min={0} />

            {allValid && result && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: data.formula,
                  inputs: [
                    { label: data.variables.bw.label, value: bw, unit: data.variables.bw.unit },
                    { label: data.variables.d.label, value: d, unit: data.variables.d.unit },
                    { label: data.variables.Asl.label, value: Asl, unit: data.variables.Asl.unit },
                    { label: data.variables.fck.label, value: fck, unit: data.variables.fck.unit },
                    { label: data.variables.fyk.label, value: fyk, unit: data.variables.fyk.unit },
                    { label: data.variables.VEd.label, value: VEd, unit: data.variables.VEd.unit },
                    { label: "k factor", value: result.k.toFixed(3), unit: "" },
                    { label: "ρl (long. ratio)", value: (result.rhoL * 100).toFixed(3), unit: "%" },
                    { label: "VRd,c", value: result.VRdc.toFixed(2), unit: "kN" },
                    { label: "cot θ", value: result.cotTheta.toFixed(2), unit: "" },
                    { label: "VRd,max", value: result.VRdmax.toFixed(2), unit: "kN" },
                  ],
                  result: {
                    label: result.shearReinfRequired
                      ? `Shear reinf. required — Asw/s ≥ ${result.AswsRequired.toFixed(3)} mm²/mm`
                      : `No shear reinf. required — VRd,c = ${result.VRdc.toFixed(2)} kN`,
                    value: result.VRdc.toFixed(2),
                    unit: "kN",
                  },
                  additionalResults: hasLinks && result.VRds !== null ? [
                    { label: "VRd,s (provided links)", value: result.VRds.toFixed(2), unit: "kN" },
                    { label: "Utilisation", value: (result.utilisation * 100).toFixed(1), unit: "%" },
                    { label: "Status", value: result.pass ? "PASS" : "FAIL", unit: "" },
                  ] : [],
                  disclaimer: DISCLAIMER_TEXT,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            {result ? (
              <>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">Intermediate Values</h3>
                <CalcResult label="k factor" value={result.k} unit="" decimals={3} />
                <CalcResult label="Longitudinal ratio ρl" value={result.rhoL * 100} unit="%" decimals={3} />
                <CalcResult label="VRd,c (concrete resistance)" value={result.VRdc} unit="kN" />
                <CalcResult label="VRd,c,min" value={result.VRdcMin} unit="kN" />

                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 pt-2">Shear Reinforcement</h3>

                {result.shearReinfRequired ? (
                  <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3">
                    <p className="text-sm font-medium text-amber-800">Shear reinforcement required</p>
                    <p className="text-xs text-amber-700 mt-1">VEd ({VEd} kN) &gt; VRd,c ({result.VRdc.toFixed(2)} kN)</p>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-green-50 border border-green-200 p-3">
                    <p className="text-sm font-medium text-green-800">No shear reinforcement required</p>
                    <p className="text-xs text-green-700 mt-1">Provide minimum links only</p>
                  </div>
                )}

                <CalcResult label="cot θ (optimised)" value={result.cotTheta} unit="" decimals={2} />
                <CalcResult label="VRd,max (strut crushing)" value={result.VRdmax} unit="kN" />
                <CalcResult label="Asw/s required" value={result.AswsRequired} unit="mm²/mm" decimals={3} />
                <CalcResult label="Asw/s minimum (ρw,min)" value={result.AswsMin} unit="mm²/mm" decimals={3} />
                <CalcResult label="Max link spacing sl,max" value={result.slMax} unit="mm" decimals={0} />

                {hasLinks && result.VRds !== null && (
                  <>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 pt-2">Utilisation Check</h3>
                    <CalcResult label="VRd,s (provided links)" value={result.VRds} unit="kN" />
                    <div className={`rounded-2xl p-3 border ${result.pass ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                      <p className={`text-sm font-semibold ${result.pass ? "text-green-800" : "text-red-800"}`}>
                        {result.pass ? "PASS" : "FAIL"} — {(result.utilisation * 100).toFixed(1)}% utilisation
                      </p>
                      <p className={`text-xs mt-1 ${result.pass ? "text-green-700" : "text-red-700"}`}>
                        VEd / min(VRd,s, VRd,max) = {result.utilisation.toFixed(3)}
                      </p>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <CalcResult label="VRd,c (concrete resistance)" value={null} unit="kN" />
                <CalcResult label="VRd,max (strut crushing)" value={null} unit="kN" />
                <CalcResult label="Asw/s required" value={null} unit="mm²/mm" />
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
            { label: data.variables.bw.label, value: bw, unit: data.variables.bw.unit },
            { label: data.variables.d.label, value: d, unit: data.variables.d.unit },
            { label: data.variables.Asl.label, value: Asl, unit: data.variables.Asl.unit },
            { label: data.variables.fck.label, value: fck, unit: data.variables.fck.unit },
            { label: data.variables.fyk.label, value: fyk, unit: data.variables.fyk.unit },
            { label: data.variables.VEd.label, value: VEd, unit: data.variables.VEd.unit },
            { label: "k factor", value: result.k.toFixed(3), unit: "" },
            { label: "VRd,c", value: result.VRdc.toFixed(2), unit: "kN" },
            { label: "cot θ", value: result.cotTheta.toFixed(2), unit: "" },
            { label: "VRd,max", value: result.VRdmax.toFixed(2), unit: "kN" },
          ]}
          result={{
            label: result.shearReinfRequired
              ? `Shear reinf. required — Asw/s ≥ ${result.AswsRequired.toFixed(3)} mm²/mm`
              : `No shear reinf. required — VRd,c = ${result.VRdc.toFixed(2)} kN`,
            value: result.VRdc.toFixed(2),
            unit: "kN",
          }}
          disclaimer={DISCLAIMER_TEXT}
        />
      )}
    </>
  );
}
