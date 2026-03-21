"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { rcBeamMoment } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";

const data = formulaData.rc_beam_moment;

const fckOptions = [25, 30, 35, 40];

export default function RCBeamPage() {
  const [b, setB] = useState("");
  const [d, setD] = useState("");
  const [As, setAs] = useState("");
  const [fck, setFck] = useState("30");
  const [MEd, setMEd] = useState("");

  const fyk = 500; // Fixed for Malaysia H-bar

  const bVal = parseFloat(b);
  const dVal = parseFloat(d);
  const asVal = parseFloat(As);
  const fckVal = parseFloat(fck);
  const medVal = parseFloat(MEd);

  const { savedList, save, remove, clearAll } = useCalcStorage("rc-beam-moment");

  // Validation
  const bError =
    b !== "" && !isNaN(bVal) && bVal <= 0
      ? "Beam width must be positive"
      : undefined;
  const dError =
    d !== "" && !isNaN(dVal) && dVal <= 0
      ? "Effective depth must be positive"
      : undefined;
  const asError =
    As !== "" && !isNaN(asVal) && asVal <= 0
      ? "Steel area must be positive"
      : undefined;
  const medError =
    MEd !== "" && !isNaN(medVal) && medVal < 0
      ? "Moment cannot be negative"
      : undefined;

  const hasErrors = !!bError || !!dError || !!asError || !!medError;
  const allValid =
    !isNaN(bVal) &&
    !isNaN(dVal) &&
    !isNaN(asVal) &&
    bVal > 0 &&
    dVal > 0 &&
    asVal > 0 &&
    !hasErrors;

  const result = allValid
    ? rcBeamMoment(
        bVal,
        dVal,
        asVal,
        fckVal,
        fyk,
        MEd !== "" && !isNaN(medVal) && medVal > 0 ? medVal : undefined
      )
    : null;

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: "Structural", href: "/calculators/concrete" }, { label: "RC Beam Capacity" }]} />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { b, d, As, fck, MEd })}
          onLoad={(v) => { setB(v.b ?? ""); setD(v.d ?? ""); setAs(v.As ?? ""); setFck(v.fck ?? "30"); setMEd(v.MEd ?? ""); }}
          onRemove={remove}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />

        {/* Sub-formulas */}
        <div className="grid gap-2 md:grid-cols-3 mb-6">
          <div className="rounded-2xl bg-stone-50 border border-stone-200 p-3">
            <p className="text-sm font-mono text-stone-700">
              {data.sub_formulas.lever_arm}
            </p>
          </div>
          <div className="rounded-2xl bg-stone-50 border border-stone-200 p-3">
            <p className="text-sm font-mono text-stone-700">
              {data.sub_formulas.K}
            </p>
          </div>
          <div className="rounded-2xl bg-stone-50 border border-stone-200 p-3">
            <p className="text-sm font-mono text-stone-700">
              {data.sub_formulas.K_limit}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <CalcInput
              name="b"
              label={data.variables.b.label}
              unit={data.variables.b.unit}
              hint={data.variables.b.hint}
              value={b}
              onChange={setB}
              min={0}
              error={bError}
            />
            <CalcInput
              name="d"
              label={data.variables.d.label}
              unit={data.variables.d.unit}
              hint={data.variables.d.hint}
              value={d}
              onChange={setD}
              min={0}
              error={dError}
            />
            <CalcInput
              name="As"
              label={data.variables.As.label}
              unit={data.variables.As.unit}
              hint={data.variables.As.hint}
              value={As}
              onChange={setAs}
              min={0}
              error={asError}
            />

            {/* fck dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-stone-700 mb-1">
                {data.variables.fck.label}{" "}
                <span className="text-stone-400">({data.variables.fck.unit})</span>
              </label>
              <select
                value={fck}
                onChange={(e) => setFck(e.target.value)}
                className="w-full rounded-2xl border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:border-amber-500 focus:ring-amber-500"
              >
                {fckOptions.map((v) => (
                  <option key={v} value={v}>
                    C{v}/{v + 5} — {v} MPa
                  </option>
                ))}
              </select>
            </div>

            {/* fyk fixed display */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-stone-700 mb-1">
                {data.variables.fyk.label}{" "}
                <span className="text-stone-400">({data.variables.fyk.unit})</span>
              </label>
              <div className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-600">
                500 MPa (H-bar, Malaysia standard)
              </div>
            </div>

            {/* Optional MEd */}
            <h3 className="text-sm font-semibold text-stone-600 mb-2 mt-6 uppercase tracking-wide">
              Utilisation Check (Optional)
            </h3>
            <CalcInput
              name="MEd"
              label={data.variables.MEd.label}
              unit={data.variables.MEd.unit}
              hint={data.variables.MEd.hint}
              value={MEd}
              onChange={setMEd}
              min={0}
              error={medError}
            />

            {allValid && result !== null && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: data.formula,
                  inputs: [
                    { label: data.variables.b.label, value: b, unit: data.variables.b.unit },
                    { label: data.variables.d.label, value: d, unit: data.variables.d.unit },
                    { label: data.variables.As.label, value: As, unit: data.variables.As.unit },
                    { label: data.variables.fck.label, value: fck, unit: data.variables.fck.unit },
                    { label: data.variables.fyk.label, value: "500", unit: data.variables.fyk.unit },
                    ...(MEd !== "" && !isNaN(medVal) && medVal > 0
                      ? [{ label: data.variables.MEd.label, value: MEd, unit: data.variables.MEd.unit }]
                      : []),
                    { label: "K value", value: result.K.toFixed(4), unit: `(K' = ${result.K_limit})` },
                    { label: "Lever Arm (z)", value: result.z.toFixed(1), unit: "mm" },
                  ],
                  result: {
                    label: `${data.result.Mu.label}${result.utilisation !== null ? ` — ${result.passUtilisation ? "PASS" : "FAIL"} (${((result.utilisation ?? 0) * 100).toFixed(1)}%)` : ""}`,
                    value: result.Mu.toFixed(4),
                    unit: data.result.Mu.unit,
                  },
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            {result && (
              <>
                <CalcResult label="K value" value={result.K} unit="" />
                <div
                  className={`rounded-2xl border p-3 text-sm ${
                    result.singlyReinforced
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-red-200 bg-red-50 text-red-800"
                  }`}
                >
                  K = {result.K.toFixed(4)} {result.singlyReinforced ? "≤" : ">"}{" "}
                  K&apos; = {result.K_limit} —{" "}
                  {result.singlyReinforced
                    ? "Singly reinforced OK"
                    : "Doubly reinforced required"}
                </div>

                <CalcResult
                  label="Lever Arm (z)"
                  value={result.z}
                  unit="mm"
                />
                <CalcResult
                  label={data.result.Mu.label}
                  value={result.Mu}
                  unit={data.result.Mu.unit}
                />

                {result.utilisation !== null && (
                  <>
                    <CalcResult
                      label="Utilisation (MEd / Mu)"
                      value={result.utilisation}
                      unit=""
                    />
                    <div
                      className={`rounded-2xl border p-4 text-center text-lg font-bold ${
                        result.passUtilisation
                          ? "border-green-200 bg-green-50 text-green-800"
                          : "border-red-200 bg-red-50 text-red-800"
                      }`}
                    >
                      {result.passUtilisation ? "PASS" : "FAIL"} —{" "}
                      {((result.utilisation ?? 0) * 100).toFixed(1)}% utilised
                    </div>
                  </>
                )}
              </>
            )}
            {!result && (
              <CalcResult
                label={data.result.Mu.label}
                value={null}
                unit={data.result.Mu.unit}
              />
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
          formula={data.formula}
          inputs={[
            { label: data.variables.b.label, value: b, unit: data.variables.b.unit },
            { label: data.variables.d.label, value: d, unit: data.variables.d.unit },
            { label: data.variables.As.label, value: As, unit: data.variables.As.unit },
            { label: data.variables.fck.label, value: fck, unit: data.variables.fck.unit },
            { label: data.variables.fyk.label, value: "500", unit: data.variables.fyk.unit },
            ...(MEd !== "" && !isNaN(medVal) && medVal > 0
              ? [{ label: data.variables.MEd.label, value: MEd, unit: data.variables.MEd.unit }]
              : []),
            { label: "K value", value: result.K.toFixed(4), unit: `(K' = ${result.K_limit})` },
            { label: "Lever Arm (z)", value: result.z.toFixed(1), unit: "mm" },
          ]}
          result={{
            label: `${data.result.Mu.label}${result.utilisation !== null ? ` — ${result.passUtilisation ? "PASS" : "FAIL"} (${((result.utilisation ?? 0) * 100).toFixed(1)}%)` : ""}`,
            value: result.Mu.toFixed(4),
            unit: data.result.Mu.unit,
          }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
