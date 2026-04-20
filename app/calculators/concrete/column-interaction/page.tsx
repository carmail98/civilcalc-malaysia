"use client";

import { useState, useMemo } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { rcColumnInteraction, rcColumnCheck } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import KeyTerms from "@/components/KeyTerms";
import { keyTerms } from "@/data/key-terms";

const data = formulaData.rc_column_interaction;

const DISCLAIMER_TEXT =
  "This output is an engineering calculation aid only and does not constitute a final or endorsed design. All designs submitted to Malaysian authorities must be endorsed by a registered Professional Engineer (PE) under the Board of Engineers Malaysia (BEM) in accordance with the Registration of Engineers Act 1967.";

export default function ColumnInteractionPage() {
  const [b, setB] = useState("300");
  const [h, setH] = useState("400");
  const [dPrime, setDPrime] = useState("50");
  const [AsFace1, setAsFace1] = useState("1570");
  const [AsFace2, setAsFace2] = useState("1570");
  const [fck, setFck] = useState("30");
  const [fyk, setFyk] = useState("500");
  const [NEd, setNEd] = useState("");
  const [MEd, setMEd] = useState("");

  const bVal = parseFloat(b);
  const hVal = parseFloat(h);
  const dPrimeVal = parseFloat(dPrime);
  const As1Val = parseFloat(AsFace1);
  const As2Val = parseFloat(AsFace2);
  const fckVal = parseFloat(fck);
  const fykVal = parseFloat(fyk);
  const NEdVal = parseFloat(NEd);
  const MEdVal = parseFloat(MEd);

  const { savedList, save, remove, clearAll, exportCalcs, importCalcs, isLoggedIn, syncing } = useCalcStorage("column-interaction");

  const sectionValid =
    !isNaN(bVal) && bVal > 0 &&
    !isNaN(hVal) && hVal > 0 &&
    !isNaN(dPrimeVal) && dPrimeVal > 0 &&
    !isNaN(As1Val) && As1Val > 0 &&
    !isNaN(As2Val) && As2Val > 0 &&
    !isNaN(fckVal) && fckVal > 0 &&
    !isNaN(fykVal) && fykVal > 0;

  const hasLoadPoint = !isNaN(NEdVal) && !isNaN(MEdVal) && MEdVal >= 0;

  const diagram = useMemo(() => {
    if (!sectionValid) return null;
    return rcColumnInteraction(bVal, hVal, dPrimeVal, As1Val, As2Val, fckVal, fykVal);
  }, [sectionValid, bVal, hVal, dPrimeVal, As1Val, As2Val, fckVal, fykVal]);

  const checkResult = useMemo(() => {
    if (!sectionValid || !hasLoadPoint || !diagram) return null;
    return rcColumnCheck(bVal, hVal, dPrimeVal, As1Val, As2Val, fckVal, fykVal, NEdVal, MEdVal);
  }, [sectionValid, hasLoadPoint, diagram, bVal, hVal, dPrimeVal, As1Val, As2Val, fckVal, fykVal, NEdVal, MEdVal]);

  // SVG interaction diagram
  const svgDiagram = useMemo(() => {
    if (!diagram) return null;
    const pts = diagram.points;
    const allN = pts.map((p) => p.N);
    const allM = pts.map((p) => p.M);
    const Nmin = Math.min(...allN);
    const Nmax = Math.max(...allN);
    const Mmax = Math.max(...allM) * 1.1;
    const Nrange = Nmax - Nmin || 1;

    const W = 340;
    const H = 300;
    const pad = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;

    const toX = (m: number) => pad.left + (m / Mmax) * chartW;
    const toY = (n: number) => pad.top + ((Nmax - n) / Nrange) * chartH;

    const polyPoints = pts
      .map((p) => `${toX(p.M)},${toY(p.N)}`)
      .join(" ");

    const loadX = hasLoadPoint ? toX(MEdVal) : null;
    const loadY = hasLoadPoint ? toY(NEdVal) : null;
    const loadInside = checkResult?.pass;

    return { W, H, pad, polyPoints, toX, toY, loadX, loadY, loadInside, Nmin, Nmax, Mmax };
  }, [diagram, hasLoadPoint, MEdVal, NEdVal, checkResult]);

  return (
    <>
      <div className="print:hidden">
        <Breadcrumbs
          items={[
            { label: "Structural", href: "/calculators/concrete" },
            { label: "Column N-M Interaction" },
          ]}
        />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) =>
            save(name, { b, h, dPrime, AsFace1, AsFace2, fck, fyk, NEd, MEd })
          }
          onLoad={(v) => {
            setB(v.b ?? "300");
            setH(v.h ?? "400");
            setDPrime(v.dPrime ?? "50");
            setAsFace1(v.AsFace1 ?? "1570");
            setAsFace2(v.AsFace2 ?? "1570");
            setFck(v.fck ?? "30");
            setFyk(v.fyk ?? "500");
            setNEd(v.NEd ?? "");
            setMEd(v.MEd ?? "");
          }}
          onRemove={remove}
          onExport={exportCalcs}
          onImport={importCalcs}
          onReset={() => { setB("300"); setH("400"); setDPrime("50"); setAsFace1("1570"); setAsFace2("1570"); setFck("30"); setFyk("500"); setNEd(""); setMEd(""); }}
          isLoggedIn={isLoggedIn}
          syncing={syncing}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />

        <div className="rounded-2xl bg-stone-50 border border-stone-200 p-3 mb-6">
          <p className="text-sm text-stone-700">
            <strong>Simplified rectangular stress block (EC2 Cl. 6.1):</strong> λ = 0.8, η = 1.0, εcu = 0.0035.
            γc = 1.5, γs = 1.15, αcc = 0.85. Symmetric reinforcement (2 faces).
          </p>
        </div>

        <KeyTerms terms={keyTerms["column-interaction"].terms} standard={keyTerms["column-interaction"].standard} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-3">Section &amp; Steel</h3>
            <CalcInput name="b" label={data.variables.b.label} unit={data.variables.b.unit} hint={data.variables.b.hint} value={b} onChange={setB} min={0} />
            <CalcInput name="h" label={data.variables.h.label} unit={data.variables.h.unit} hint={data.variables.h.hint} value={h} onChange={setH} min={0} />
            <CalcInput name="dPrime" label={data.variables.dPrime.label} unit={data.variables.dPrime.unit} hint={data.variables.dPrime.hint} value={dPrime} onChange={setDPrime} min={0} />
            <CalcInput name="AsFace1" label={data.variables.AsFace1.label} unit={data.variables.AsFace1.unit} hint={data.variables.AsFace1.hint} value={AsFace1} onChange={setAsFace1} min={0} />
            <CalcInput name="AsFace2" label={data.variables.AsFace2.label} unit={data.variables.AsFace2.unit} hint={data.variables.AsFace2.hint} value={AsFace2} onChange={setAsFace2} min={0} />

            <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-3 mt-4">Materials</h3>
            <CalcInput name="fck" label={data.variables.fck.label} unit={data.variables.fck.unit} hint={data.variables.fck.hint} value={fck} onChange={setFck} min={0} />
            <CalcInput name="fyk" label={data.variables.fyk.label} unit={data.variables.fyk.unit} hint={data.variables.fyk.hint} value={fyk} onChange={setFyk} min={0} />

            <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-3 mt-4">Applied Load Point (optional)</h3>
            <CalcInput name="NEd" label={data.variables.NEd.label} unit={data.variables.NEd.unit} hint={data.variables.NEd.hint} value={NEd} onChange={setNEd} />
            <CalcInput name="MEd" label={data.variables.MEd.label} unit={data.variables.MEd.unit} hint={data.variables.MEd.hint} value={MEd} onChange={setMEd} min={0} />

            {sectionValid && diagram && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: data.formula,
                  inputs: [
                    { label: data.variables.b.label, value: b, unit: data.variables.b.unit },
                    { label: data.variables.h.label, value: h, unit: data.variables.h.unit },
                    { label: data.variables.dPrime.label, value: dPrime, unit: data.variables.dPrime.unit },
                    { label: data.variables.AsFace1.label, value: AsFace1, unit: data.variables.AsFace1.unit },
                    { label: data.variables.AsFace2.label, value: AsFace2, unit: data.variables.AsFace2.unit },
                    { label: data.variables.fck.label, value: fck, unit: data.variables.fck.unit },
                    { label: data.variables.fyk.label, value: fyk, unit: data.variables.fyk.unit },
                    ...(hasLoadPoint
                      ? [
                          { label: data.variables.NEd.label, value: NEd, unit: data.variables.NEd.unit },
                          { label: data.variables.MEd.label, value: MEd, unit: data.variables.MEd.unit },
                        ]
                      : []),
                  ],
                  result: {
                    label: "Pure Compression Capacity (Nmax)",
                    value: diagram.Nmax.toFixed(1),
                    unit: "kN",
                  },
                  additionalResults: [
                    { label: "Balanced Axial Load (Nbal)", value: diagram.Nbal.toFixed(1), unit: "kN" },
                    { label: "Balanced Moment (Mbal)", value: diagram.Mbal.toFixed(2), unit: "kN·m" },
                    { label: "Pure Bending Capacity (M0)", value: diagram.M0.toFixed(2), unit: "kN·m" },
                    { label: "As,min", value: diagram.AsMin.toFixed(0), unit: "mm²" },
                    { label: "As,max (4%Ac)", value: diagram.AsMax.toFixed(0), unit: "mm²" },
                    ...(checkResult
                      ? [
                          { label: "Utilisation (MEd/Mcap)", value: (checkResult.utilisationRatio * 100).toFixed(1), unit: "%" },
                          { label: "Status", value: checkResult.pass ? "PASS" : "FAIL", unit: "" },
                        ]
                      : []),
                  ],
                  disclaimer: DISCLAIMER_TEXT,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            {diagram ? (
              <>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">N-M Interaction Diagram</h3>

                {/* SVG diagram */}
                {svgDiagram && (
                  <div className="rounded-2xl border border-stone-200 bg-white p-2 overflow-auto">
                    <svg width={svgDiagram.W} height={svgDiagram.H} viewBox={`0 0 ${svgDiagram.W} ${svgDiagram.H}`}>
                      {/* Grid lines */}
                      <line x1={svgDiagram.pad.left} y1={svgDiagram.pad.top}
                        x2={svgDiagram.pad.left} y2={svgDiagram.H - svgDiagram.pad.bottom}
                        stroke="#e5e7eb" strokeWidth="1" />
                      <line x1={svgDiagram.pad.left} y1={svgDiagram.H - svgDiagram.pad.bottom}
                        x2={svgDiagram.W - svgDiagram.pad.right} y2={svgDiagram.H - svgDiagram.pad.bottom}
                        stroke="#e5e7eb" strokeWidth="1" />

                      {/* N=0 axis */}
                      <line
                        x1={svgDiagram.pad.left}
                        y1={svgDiagram.toY(0)}
                        x2={svgDiagram.W - svgDiagram.pad.right}
                        y2={svgDiagram.toY(0)}
                        stroke="#d1d5db" strokeWidth="1" strokeDasharray="4,3"
                      />

                      {/* Interaction curve */}
                      <polyline
                        points={svgDiagram.polyPoints}
                        fill="rgba(59,130,246,0.1)"
                        stroke="#2563eb"
                        strokeWidth="2"
                      />

                      {/* Load point */}
                      {svgDiagram.loadX !== null && svgDiagram.loadY !== null && (
                        <>
                          <line
                            x1={svgDiagram.loadX} y1={svgDiagram.pad.top}
                            x2={svgDiagram.loadX} y2={svgDiagram.H - svgDiagram.pad.bottom}
                            stroke="#9ca3af" strokeWidth="1" strokeDasharray="3,3"
                          />
                          <line
                            x1={svgDiagram.pad.left} y1={svgDiagram.loadY}
                            x2={svgDiagram.W - svgDiagram.pad.right} y2={svgDiagram.loadY}
                            stroke="#9ca3af" strokeWidth="1" strokeDasharray="3,3"
                          />
                          <circle
                            cx={svgDiagram.loadX} cy={svgDiagram.loadY} r={6}
                            fill={svgDiagram.loadInside ? "#16a34a" : "#dc2626"}
                            stroke="white" strokeWidth="2"
                          />
                        </>
                      )}

                      {/* Axis labels */}
                      <text x={svgDiagram.pad.left - 8} y={svgDiagram.pad.top + 4} textAnchor="end" fontSize="9" fill="#6b7280">{Math.round(svgDiagram.Nmax)}</text>
                      <text x={svgDiagram.pad.left - 8} y={svgDiagram.H - svgDiagram.pad.bottom} textAnchor="end" fontSize="9" fill="#6b7280">{Math.round(svgDiagram.Nmin)}</text>
                      <text x={svgDiagram.W - svgDiagram.pad.right} y={svgDiagram.H - svgDiagram.pad.bottom + 14} textAnchor="end" fontSize="9" fill="#6b7280">{Math.round(svgDiagram.Mmax)}</text>

                      {/* Axis titles */}
                      <text x={svgDiagram.W / 2} y={svgDiagram.H - 4} textAnchor="middle" fontSize="10" fill="#374151">M (kN·m)</text>
                      <text
                        x={14} y={svgDiagram.H / 2}
                        textAnchor="middle" fontSize="10" fill="#374151"
                        transform={`rotate(-90, 14, ${svgDiagram.H / 2})`}
                      >N (kN)</text>
                    </svg>
                  </div>
                )}

                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 pt-2">Key Points</h3>
                <CalcResult label="Nmax (pure compression)" value={diagram.Nmax} unit="kN" decimals={1} />
                <CalcResult label="Nbal (balanced)" value={diagram.Nbal} unit="kN" decimals={1} />
                <CalcResult label="Mbal (balanced moment)" value={diagram.Mbal} unit="kN·m" />
                <CalcResult label="M₀ (pure bending)" value={diagram.M0} unit="kN·m" />

                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 pt-2">Steel Check</h3>
                <CalcResult label="As,min" value={diagram.AsMin} unit="mm²" decimals={0} />
                <CalcResult label="As,max (4% Ac)" value={diagram.AsMax} unit="mm²" decimals={0} />

                {checkResult && (
                  <>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 pt-2">Load Point Check</h3>
                    <div className={`rounded-2xl p-3 border ${checkResult.pass ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                      <p className={`text-sm font-semibold ${checkResult.pass ? "text-green-800" : "text-red-800"}`}>
                        {checkResult.pass ? "PASS" : "FAIL"} — {(checkResult.utilisationRatio * 100).toFixed(1)}% utilisation
                      </p>
                      <p className={`text-xs mt-1 ${checkResult.pass ? "text-green-700" : "text-red-700"}`}>
                        MEd / Mcapacity at NEd = {checkResult.utilisationRatio.toFixed(3)}
                      </p>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <CalcResult label="Nmax (pure compression)" value={null} unit="kN" />
                <CalcResult label="Mbal (balanced moment)" value={null} unit="kN·m" />
                <CalcResult label="M₀ (pure bending)" value={null} unit="kN·m" />
              </>
            )}
          </div>
        </div>

        <Disclaimer text={DISCLAIMER_TEXT} />
      </div>

      {sectionValid && diagram && (
        <PrintNote
          title={data.name}
          reference={data.reference}
          formula={data.formula}
          inputs={[
            { label: data.variables.b.label, value: b, unit: data.variables.b.unit },
            { label: data.variables.h.label, value: h, unit: data.variables.h.unit },
            { label: data.variables.dPrime.label, value: dPrime, unit: data.variables.dPrime.unit },
            { label: data.variables.AsFace1.label, value: AsFace1, unit: data.variables.AsFace1.unit },
            { label: data.variables.AsFace2.label, value: AsFace2, unit: data.variables.AsFace2.unit },
            { label: data.variables.fck.label, value: fck, unit: data.variables.fck.unit },
            { label: data.variables.fyk.label, value: fyk, unit: data.variables.fyk.unit },
          ]}
          result={{
            label: "Pure Compression Capacity (Nmax)",
            value: diagram.Nmax.toFixed(1),
            unit: "kN",
          }}
          disclaimer={DISCLAIMER_TEXT}
        />
      )}
    </>
  );
}
