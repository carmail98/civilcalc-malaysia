"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { padFootingDesign } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import KeyTerms from "@/components/KeyTerms";
import { keyTerms } from "@/data/key-terms";

const data = formulaData.pad_footing;

const DISCLAIMER_TEXT =
  "This output is an engineering calculation aid only and does not constitute a final or endorsed design. All designs submitted to Malaysian authorities must be endorsed by a registered Professional Engineer (PE) under the Board of Engineers Malaysia (BEM) in accordance with the Registration of Engineers Act 1967.";

export default function PadFootingPage() {
  const [colWidth, setColWidth] = useState("300");
  const [colDepth, setColDepth] = useState("300");
  const [Nsls, setNsls] = useState("");
  const [Nuls, setNuls] = useState("");
  const [B, setB] = useState("1800");
  const [L, setL] = useState("1800");
  const [h, setH] = useState("500");
  const [cover, setCover] = useState("40");
  const [barDia, setBarDia] = useState("16");
  const [fck, setFck] = useState("30");
  const [fyk, setFyk] = useState("500");
  const [qAllowable, setQAllowable] = useState("150");
  const [Msls, setMsls] = useState("");
  const [Muls, setMuls] = useState("");

  const colWidthVal = parseFloat(colWidth);
  const colDepthVal = parseFloat(colDepth);
  const NslsVal = parseFloat(Nsls);
  const NulsVal = parseFloat(Nuls);
  const BVal = parseFloat(B);
  const LVal = parseFloat(L);
  const hVal = parseFloat(h);
  const coverVal = parseFloat(cover);
  const barDiaVal = parseFloat(barDia);
  const fckVal = parseFloat(fck);
  const fykVal = parseFloat(fyk);
  const qAllVal = parseFloat(qAllowable);
  const MslsVal = parseFloat(Msls) || 0;
  const MulsVal = parseFloat(Muls) || 0;

  const { savedList, save, remove, clearAll } = useCalcStorage("pad-footing");

  const allValid =
    !isNaN(colWidthVal) && colWidthVal > 0 &&
    !isNaN(colDepthVal) && colDepthVal > 0 &&
    !isNaN(NslsVal) && NslsVal > 0 &&
    !isNaN(NulsVal) && NulsVal > 0 &&
    !isNaN(BVal) && BVal > 0 &&
    !isNaN(LVal) && LVal > 0 &&
    !isNaN(hVal) && hVal > 0 &&
    !isNaN(coverVal) && coverVal > 0 &&
    !isNaN(barDiaVal) && barDiaVal > 0 &&
    !isNaN(fckVal) && fckVal > 0 &&
    !isNaN(fykVal) && fykVal > 0 &&
    !isNaN(qAllVal) && qAllVal > 0;

  const result = allValid
    ? padFootingDesign(
        colWidthVal, colDepthVal, NslsVal, NulsVal,
        BVal, LVal, hVal, coverVal, barDiaVal,
        fckVal, fykVal, qAllVal,
        MslsVal > 0 ? MslsVal : undefined,
        MulsVal > 0 ? MulsVal : undefined
      )
    : null;

  const statusBox = (pass: boolean, label: string, utilisation: number) => (
    <div className={`rounded-2xl p-3 border ${pass ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
      <p className={`text-sm font-semibold ${pass ? "text-green-800" : "text-red-800"}`}>
        {pass ? "PASS" : "FAIL"} — {label}
      </p>
      <p className={`text-xs mt-1 ${pass ? "text-green-700" : "text-red-700"}`}>
        Utilisation: {(utilisation * 100).toFixed(1)}%
      </p>
    </div>
  );

  return (
    <>
      <div className="print:hidden">
        <Breadcrumbs
          items={[
            { label: "Structural", href: "/calculators/concrete" },
            { label: "Pad Footing Design" },
          ]}
        />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) =>
            save(name, { colWidth, colDepth, Nsls, Nuls, B, L, h, cover, barDia, fck, fyk, qAllowable, Msls, Muls })
          }
          onLoad={(v) => {
            setColWidth(v.colWidth ?? "300");
            setColDepth(v.colDepth ?? "300");
            setNsls(v.Nsls ?? "");
            setNuls(v.Nuls ?? "");
            setB(v.B ?? "1800");
            setL(v.L ?? "1800");
            setH(v.h ?? "500");
            setCover(v.cover ?? "40");
            setBarDia(v.barDia ?? "16");
            setFck(v.fck ?? "30");
            setFyk(v.fyk ?? "500");
            setQAllowable(v.qAllowable ?? "150");
            setMsls(v.Msls ?? "");
            setMuls(v.Muls ?? "");
          }}
          onRemove={remove}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />

        <div className="rounded-2xl bg-stone-50 border border-stone-200 p-3 mb-6">
          <p className="text-sm text-stone-700">
            <strong>Three-check design:</strong> (1) Bearing pressure (SLS) against allowable, (2) Flexure (ULS) — cantilever from column face, (3) Punching shear (ULS) at 2d perimeter. Footing self-weight included in bearing check.
          </p>
        </div>

        <KeyTerms terms={keyTerms["pad-footing"].terms} standard={keyTerms["pad-footing"].standard} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-3">Column</h3>
            <CalcInput name="colWidth" label={data.variables.colWidth.label} unit={data.variables.colWidth.unit} hint={data.variables.colWidth.hint} value={colWidth} onChange={setColWidth} min={0} />
            <CalcInput name="colDepth" label={data.variables.colDepth.label} unit={data.variables.colDepth.unit} hint={data.variables.colDepth.hint} value={colDepth} onChange={setColDepth} min={0} />

            <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-3 mt-4">Loads</h3>
            <CalcInput name="Nsls" label={data.variables.Nsls.label} unit={data.variables.Nsls.unit} hint={data.variables.Nsls.hint} value={Nsls} onChange={setNsls} min={0} />
            <CalcInput name="Nuls" label={data.variables.Nuls.label} unit={data.variables.Nuls.unit} hint={data.variables.Nuls.hint} value={Nuls} onChange={setNuls} min={0} />
            <CalcInput name="Msls" label="SLS Moment (optional)" unit="kN·m" hint="Leave blank for concentric load" value={Msls} onChange={setMsls} min={0} />
            <CalcInput name="Muls" label="ULS Moment (optional)" unit="kN·m" hint="Leave blank for concentric load" value={Muls} onChange={setMuls} min={0} />

            <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-3 mt-4">Footing Geometry</h3>
            <CalcInput name="B" label={data.variables.B.label} unit={data.variables.B.unit} hint={data.variables.B.hint} value={B} onChange={setB} min={0} />
            <CalcInput name="L" label={data.variables.L.label} unit={data.variables.L.unit} hint={data.variables.L.hint} value={L} onChange={setL} min={0} />
            <CalcInput name="h" label={data.variables.h.label} unit={data.variables.h.unit} hint={data.variables.h.hint} value={h} onChange={setH} min={0} />
            <CalcInput name="cover" label={data.variables.cover.label} unit={data.variables.cover.unit} hint={data.variables.cover.hint} value={cover} onChange={setCover} min={0} />
            <CalcInput name="barDia" label={data.variables.barDia.label} unit={data.variables.barDia.unit} hint={data.variables.barDia.hint} value={barDia} onChange={setBarDia} min={0} />

            <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-3 mt-4">Materials &amp; Soil</h3>
            <CalcInput name="fck" label={data.variables.fck.label} unit={data.variables.fck.unit} hint={data.variables.fck.hint} value={fck} onChange={setFck} min={0} />
            <CalcInput name="fyk" label={data.variables.fyk.label} unit={data.variables.fyk.unit} hint={data.variables.fyk.hint} value={fyk} onChange={setFyk} min={0} />
            <CalcInput name="qAllowable" label={data.variables.qAllowable.label} unit={data.variables.qAllowable.unit} hint={data.variables.qAllowable.hint} value={qAllowable} onChange={setQAllowable} min={0} />

            {allValid && result && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: data.formula,
                  inputs: [
                    { label: "Column Width", value: colWidth, unit: "mm" },
                    { label: "Column Depth", value: colDepth, unit: "mm" },
                    { label: "SLS Axial Load", value: Nsls, unit: "kN" },
                    { label: "ULS Axial Load", value: Nuls, unit: "kN" },
                    { label: "Footing B × L × h", value: `${B}×${L}×${h}`, unit: "mm" },
                    { label: "fck", value: fck, unit: "MPa" },
                    { label: "Allowable Bearing", value: qAllowable, unit: "kPa" },
                    { label: "Footing Self-Weight", value: result.footingSW.toFixed(1), unit: "kN" },
                    { label: "Effective Depth", value: result.dEff.toFixed(0), unit: "mm" },
                  ],
                  result: {
                    label: `Overall ${result.overallPass ? "PASS" : "FAIL"} — Bearing ${result.bearingPass ? "OK" : "FAIL"} | Punching ${result.punchingPass ? "OK" : "FAIL"}`,
                    value: result.qMaxSLS.toFixed(1),
                    unit: "kPa",
                  },
                  additionalResults: [
                    { label: "As required (long dir)", value: result.AsReqLong.toFixed(0), unit: "mm²" },
                    { label: "As required (short dir)", value: result.AsReqShort.toFixed(0), unit: "mm²" },
                    { label: "vEd,punch", value: result.vEdPunch.toFixed(3), unit: "MPa" },
                    { label: "vRd,c,punch", value: result.vRdcPunch.toFixed(3), unit: "MPa" },
                  ],
                  disclaimer: DISCLAIMER_TEXT,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            {result ? (
              <>
                {/* Bearing */}
                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">1. Bearing Pressure (SLS)</h3>
                <CalcResult label="Footing self-weight" value={result.footingSW} unit="kN" />
                <CalcResult label="Max bearing pressure qmax" value={result.qMaxSLS} unit="kPa" />
                <CalcResult label="Min bearing pressure qmin" value={result.qMinSLS} unit="kPa" />
                {statusBox(result.bearingPass, `qmax = ${result.qMaxSLS.toFixed(1)} kPa ≤ ${qAllowable} kPa`, result.bearingUtilisation)}

                {/* Flexure */}
                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 pt-2">2. Flexure Design (ULS)</h3>
                <CalcResult label="Effective depth d" value={result.dEff} unit="mm" decimals={0} />
                <CalcResult label="ULS bearing pressure" value={result.qUls} unit="kPa" />
                <CalcResult label="MEd long direction" value={result.MEdLong} unit="kN·m" />
                <CalcResult label="As required (long)" value={result.AsReqLong} unit="mm²" decimals={0} />
                <CalcResult label="MEd short direction" value={result.MEdShort} unit="kN·m" />
                <CalcResult label="As required (short)" value={result.AsReqShort} unit="mm²" decimals={0} />
                <CalcResult label="As,min per metre" value={result.AsMinFooting} unit="mm²/m" decimals={0} />

                {/* Punching */}
                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 pt-2">3. Punching Shear (ULS)</h3>
                <CalcResult label="Control perimeter u₁ (at 2d)" value={result.u1} unit="mm" decimals={0} />
                <CalcResult label="vEd (punching shear stress)" value={result.vEdPunch} unit="MPa" decimals={3} />
                <CalcResult label="vRd,c (resistance)" value={result.vRdcPunch} unit="MPa" decimals={3} />
                {statusBox(result.punchingPass, `vEd = ${result.vEdPunch.toFixed(3)} MPa vs vRd,c = ${result.vRdcPunch.toFixed(3)} MPa`, result.punchingUtilisation)}

                {/* Overall */}
                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 pt-2">Overall Status</h3>
                <div className={`rounded-2xl p-4 border-2 ${result.overallPass ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"}`}>
                  <p className={`text-base font-bold ${result.overallPass ? "text-green-800" : "text-red-800"}`}>
                    {result.overallPass ? "OVERALL PASS" : "OVERALL FAIL"}
                  </p>
                  <p className={`text-xs mt-1 ${result.overallPass ? "text-green-700" : "text-red-700"}`}>
                    Bearing {result.bearingPass ? "✓" : "✗"} | Punching {result.punchingPass ? "✓" : "✗"}
                  </p>
                </div>
              </>
            ) : (
              <>
                <CalcResult label="Max bearing pressure" value={null} unit="kPa" />
                <CalcResult label="As required (long dir)" value={null} unit="mm²" />
                <CalcResult label="vEd (punching)" value={null} unit="MPa" />
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
            { label: "Column Width × Depth", value: `${colWidth}×${colDepth}`, unit: "mm" },
            { label: "SLS Axial Load", value: Nsls, unit: "kN" },
            { label: "ULS Axial Load", value: Nuls, unit: "kN" },
            { label: "Footing B × L × h", value: `${B}×${L}×${h}`, unit: "mm" },
            { label: "fck / fyk", value: `${fck} / ${fyk}`, unit: "MPa" },
            { label: "Allowable bearing", value: qAllowable, unit: "kPa" },
          ]}
          result={{
            label: `Overall ${result.overallPass ? "PASS" : "FAIL"} | qmax = ${result.qMaxSLS.toFixed(1)} kPa | vEd = ${result.vEdPunch.toFixed(3)} MPa`,
            value: result.qMaxSLS.toFixed(1),
            unit: "kPa",
          }}
          disclaimer={DISCLAIMER_TEXT}
        />
      )}
    </>
  );
}
