"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import {
  overlandFlowTime,
  drainFlowTime,
  timeOfConcentration,
} from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import KeyTerms from "@/components/KeyTerms";
import { keyTerms } from "@/data/key-terms";

const data = formulaData.time_of_concentration;

export default function TcPage() {
  const [n, setN] = useState("");
  const [L, setL] = useState("");
  const [S, setS] = useState("");
  const [Ld, setLd] = useState("");
  const [V, setV] = useState("");

  const nVal = parseFloat(n);
  const lVal = parseFloat(L);
  const sVal = parseFloat(S);
  const ldVal = parseFloat(Ld);
  const vVal = parseFloat(V);

  const { savedList, save, remove, clearAll, exportCalcs, importCalcs, isLoggedIn, syncing } = useCalcStorage("time-of-concentration");

  // Validation
  const nError =
    n !== "" && !isNaN(nVal)
      ? nVal < 0.01
        ? "Minimum Manning n is 0.01"
        : nVal > 0.8
        ? "Maximum Manning n is 0.80"
        : undefined
      : undefined;

  const lError =
    L !== "" && !isNaN(lVal) && lVal <= 0
      ? "Length must be positive"
      : undefined;

  const lWarning =
    L !== "" && !isNaN(lVal) && lVal > 100
      ? "Overland flow path may be too long — check MSMA Clause 2.4"
      : undefined;

  const sError =
    S !== "" && !isNaN(sVal)
      ? sVal < 0.001
        ? "Minimum slope is 0.001 m/m"
        : sVal > 0.5
        ? "Maximum slope is 0.5 m/m"
        : undefined
      : undefined;

  const ldError =
    Ld !== "" && !isNaN(ldVal) && ldVal < 0
      ? "Length cannot be negative"
      : undefined;

  const vError =
    V !== "" && !isNaN(vVal) && vVal <= 0
      ? "Velocity must be positive"
      : undefined;

  const vWarning =
    V !== "" && !isNaN(vVal) && vVal > 3.0
      ? "Flow velocity exceeds typical range (0.5–3.0 m/s)"
      : undefined;

  const hasErrors = !!nError || !!lError || !!sError || !!ldError || !!vError;
  const allValid =
    !isNaN(nVal) &&
    !isNaN(lVal) &&
    !isNaN(sVal) &&
    !isNaN(ldVal) &&
    !isNaN(vVal) &&
    !hasErrors &&
    sVal > 0 &&
    vVal > 0;

  const toVal = allValid ? overlandFlowTime(nVal, lVal, sVal) : null;
  const tdVal = allValid ? drainFlowTime(ldVal, vVal) : null;
  const tcRaw =
    toVal !== null && tdVal !== null
      ? timeOfConcentration(toVal, tdVal)
      : null;
  const tcClamped = tcRaw !== null && tcRaw < 5;

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: "Drainage", href: "/calculators/drainage" }, { label: "Time of Concentration" }]} />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { n, L, S, Ld, V })}
          onLoad={(v) => { setN(v.n ?? ""); setL(v.L ?? ""); setS(v.S ?? ""); setLd(v.Ld ?? ""); setV(v.V ?? ""); }}
          onRemove={remove}
          onExport={exportCalcs}
          onImport={importCalcs}
          isLoggedIn={isLoggedIn}
          syncing={syncing}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />

        {/* Sub-formulas */}
        <div className="grid gap-2 md:grid-cols-2 mb-6">
          <div className="rounded-2xl bg-stone-50 border border-stone-200 p-3">
            <p className="text-sm font-mono text-stone-700">
              {data.sub_formulas.to}
            </p>
            <p className="text-xs text-stone-400 mt-1">
              Friend&apos;s Formula — Overland flow
            </p>
          </div>
          <div className="rounded-2xl bg-stone-50 border border-stone-200 p-3">
            <p className="text-sm font-mono text-stone-700">
              {data.sub_formulas.td}
            </p>
            <p className="text-xs text-stone-400 mt-1">Drain/channel flow</p>
          </div>
        </div>

        <KeyTerms terms={keyTerms["time-of-concentration"].terms} standard={keyTerms["time-of-concentration"].standard} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            {/* Overland flow inputs */}
            <h3 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">
              Overland Flow (to)
            </h3>
            <CalcInput
              name="n"
              label={data.variables.n.label}
              unit={data.variables.n.unit}
              hint={data.variables.n.hint}
              value={n}
              onChange={setN}
              min={0.01}
              max={0.8}
              error={nError}
            />
            <CalcInput
              name="L"
              label={data.variables.L.label}
              unit={data.variables.L.unit}
              hint={data.variables.L.hint}
              value={L}
              onChange={setL}
              min={0}
              error={lError}
              warning={lWarning}
            />
            <CalcInput
              name="S"
              label={data.variables.S.label}
              unit={data.variables.S.unit}
              hint={data.variables.S.hint}
              value={S}
              onChange={setS}
              min={0.001}
              max={0.5}
              error={sError}
            />

            {/* Drain flow inputs */}
            <h3 className="text-sm font-semibold text-stone-600 mb-2 mt-6 uppercase tracking-wide">
              Drain Flow (td)
            </h3>
            <CalcInput
              name="Ld"
              label={data.variables.Ld.label}
              unit={data.variables.Ld.unit}
              hint={data.variables.Ld.hint}
              value={Ld}
              onChange={setLd}
              min={0}
              error={ldError}
            />
            <CalcInput
              name="V"
              label={data.variables.V.label}
              unit={data.variables.V.unit}
              hint={data.variables.V.hint}
              value={V}
              onChange={setV}
              min={0}
              error={vError}
              warning={vWarning}
            />

            {allValid && tcRaw !== null && toVal !== null && tdVal !== null && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: `${data.formula}  |  ${data.sub_formulas.to}  |  ${data.sub_formulas.td}`,
                  inputs: [
                    { label: data.variables.n.label, value: n, unit: "—" },
                    { label: data.variables.L.label, value: L, unit: data.variables.L.unit },
                    { label: data.variables.S.label, value: S, unit: data.variables.S.unit },
                    { label: data.variables.Ld.label, value: Ld, unit: data.variables.Ld.unit },
                    { label: data.variables.V.label, value: V, unit: data.variables.V.unit },
                    { label: "Overland Flow Time (to)", value: toVal.toFixed(2), unit: "min" },
                    { label: "Drain Flow Time (td)", value: tdVal.toFixed(2), unit: "min" },
                  ],
                  result: {
                    label: data.result.tc.label,
                    value: tcRaw.toFixed(2),
                    unit: data.result.tc.unit,
                  },
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            {toVal !== null && (
              <CalcResult
                label="Overland Flow Time (to)"
                value={toVal}
                unit="min"
              />
            )}
            {tdVal !== null && (
              <CalcResult
                label="Drain Flow Time (td)"
                value={tdVal}
                unit="min"
              />
            )}
            <CalcResult
              label={data.result.tc.label}
              value={tcRaw}
              unit={data.result.tc.unit}
            />
            {tcClamped && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                Minimum tc = 5 min applied (MSMA Ch 2, Clause 2.4.3)
              </div>
            )}
          </div>
        </div>

        <Disclaimer text={data.disclaimer} />
      </div>

      {/* Print view */}
      {allValid && tcRaw !== null && toVal !== null && tdVal !== null && (
        <PrintNote
          title={data.name}
          reference={data.reference}
          formula={`${data.formula}  |  ${data.sub_formulas.to}  |  ${data.sub_formulas.td}`}
          inputs={[
            { label: data.variables.n.label, value: n, unit: "—" },
            { label: data.variables.L.label, value: L, unit: data.variables.L.unit },
            { label: data.variables.S.label, value: S, unit: data.variables.S.unit },
            { label: data.variables.Ld.label, value: Ld, unit: data.variables.Ld.unit },
            { label: data.variables.V.label, value: V, unit: data.variables.V.unit },
            { label: "Overland Flow Time (to)", value: toVal.toFixed(2), unit: "min" },
            { label: "Drain Flow Time (td)", value: tdVal.toFixed(2), unit: "min" },
          ]}
          result={{
            label: data.result.tc.label,
            value: tcRaw.toFixed(2),
            unit: data.result.tc.unit,
          }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
