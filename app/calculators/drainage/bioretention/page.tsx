"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { bioretentionSizing, waterQualityVolume } from "@/lib/calcEngine";
import { BIORETENTION_PERMEABILITY } from "@/lib/msmaReferences";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";

const data = formulaData.bioretention;

export default function BioretentionPage() {
  const [catchment, setCatchment] = useState("");
  const [runoffC, setRunoffC] = useState("0.90");
  const [df, setDf] = useState("0.6");
  const [hf, setHf] = useState("0.1");
  const [tf, setTf] = useState("1");
  const [k, setK] = useState("0.312");
  const [systemType, setSystemType] = useState<"impermeable" | "permeable">(
    "impermeable"
  );

  const catchmentVal = parseFloat(catchment);
  const runoffCVal = parseFloat(runoffC);
  const dfVal = parseFloat(df);
  const hfVal = parseFloat(hf);
  const tfVal = parseFloat(tf);
  const kVal = parseFloat(k);

  const { savedList, save, remove, clearAll, exportCalcs, importCalcs, isLoggedIn, syncing } =
    useCalcStorage("bioretention");

  const catchmentError =
    catchment !== "" && !isNaN(catchmentVal) && catchmentVal <= 0
      ? "Catchment area must be positive"
      : undefined;

  const cError =
    runoffC !== "" && !isNaN(runoffCVal)
      ? runoffCVal < 0
        ? "Runoff C cannot be negative"
        : runoffCVal > 1
        ? "Runoff C cannot exceed 1"
        : undefined
      : undefined;

  const dfError =
    df !== "" && !isNaN(dfVal) && dfVal <= 0 ? "df must be positive" : undefined;

  const hfError =
    hf !== "" && !isNaN(hfVal) && hfVal < 0 ? "hf cannot be negative" : undefined;

  const tfError =
    tf !== "" && !isNaN(tfVal) && tfVal <= 0
      ? "tf must be positive"
      : undefined;

  const kError =
    k !== "" && !isNaN(kVal) && kVal <= 0 ? "k/i must be positive" : undefined;

  const hasErrors =
    !!catchmentError || !!cError || !!dfError || !!hfError || !!tfError || !!kError;

  const allValid =
    !isNaN(catchmentVal) &&
    catchmentVal > 0 &&
    !isNaN(runoffCVal) &&
    runoffCVal >= 0 &&
    !isNaN(dfVal) &&
    dfVal > 0 &&
    !isNaN(hfVal) &&
    hfVal >= 0 &&
    !isNaN(tfVal) &&
    tfVal > 0 &&
    !isNaN(kVal) &&
    kVal > 0 &&
    !hasErrors;

  const wqv = allValid ? waterQualityVolume(catchmentVal, runoffCVal) : null;
  const result =
    allValid && wqv !== null
      ? bioretentionSizing(wqv, dfVal, hfVal, tfVal, kVal, systemType)
      : null;

  return (
    <>
      <div className="print:hidden">
        <Breadcrumbs
          items={[
            { label: "Drainage", href: "/calculators/drainage" },
            { label: "Bioretention System" },
          ]}
        />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-800">
          <p>
            MSMA Ch 9 requires the bioretention system to hold the Water Quality Volume (WQv)
            from a 40 mm (3-month ARI) storm and drain it within 24 hours through a filter media
            with ≥ 13 mm/hr permeability. Minimum footprint is 3 m × 6 m (18 m²) per Table 9.6.
          </p>
        </div>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) =>
            save(name, { catchment, runoffC, df, hf, tf, k, systemType })
          }
          onLoad={(v) => {
            setCatchment(v.catchment ?? "");
            setRunoffC(v.runoffC ?? "0.90");
            setDf(v.df ?? "0.6");
            setHf(v.hf ?? "0.1");
            setTf(v.tf ?? "1");
            setK(v.k ?? "0.312");
            setSystemType((v.systemType as "impermeable" | "permeable") ?? "impermeable");
          }}
          onRemove={remove}
          onExport={exportCalcs}
          onImport={importCalcs}
          onReset={() => {
            setCatchment("");
            setRunoffC("0.90");
            setDf("0.6");
            setHf("0.1");
            setTf("1");
            setK("0.312");
            setSystemType("impermeable");
          }}
          isLoggedIn={isLoggedIn}
          syncing={syncing}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />

        <div className="grid gap-2 md:grid-cols-2 mb-6">
          <div className="rounded-2xl bg-stone-50 border border-stone-200 p-3">
            <p className="text-sm font-mono text-stone-700">{data.sub_formulas.wqv}</p>
            <p className="text-xs text-stone-400 mt-1">
              Water Quality Volume (3-month ARI = 40 mm)
            </p>
          </div>
          <div className="rounded-2xl bg-stone-50 border border-stone-200 p-3">
            <p className="text-sm font-mono text-stone-700">
              {systemType === "impermeable"
                ? data.sub_formulas.impermeable
                : data.sub_formulas.permeable}
            </p>
            <p className="text-xs text-stone-400 mt-1">
              {systemType === "impermeable"
                ? "Eq 9.1 — with underdrain"
                : "Eq 9.2 — no underdrain"}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">
              Contributing Catchment
            </h3>
            <CalcInput
              name="catchment"
              label={data.variables.catchmentArea.label}
              unit={data.variables.catchmentArea.unit}
              hint={data.variables.catchmentArea.hint}
              value={catchment}
              onChange={setCatchment}
              min={0}
              error={catchmentError}
            />
            <CalcInput
              name="runoffC"
              label={data.variables.runoffC.label}
              unit={data.variables.runoffC.unit}
              hint={data.variables.runoffC.hint}
              value={runoffC}
              onChange={setRunoffC}
              min={0}
              max={1}
              error={cError}
            />

            <h3 className="text-sm font-semibold text-stone-600 mb-2 mt-6 uppercase tracking-wide">
              System Configuration
            </h3>
            <div className="mb-4">
              <label className="mr-4 text-sm text-stone-700">
                <input
                  type="radio"
                  name="systemType"
                  value="impermeable"
                  checked={systemType === "impermeable"}
                  onChange={() => setSystemType("impermeable")}
                  className="mr-1"
                />
                Impermeable (with underdrain)
              </label>
              <label className="text-sm text-stone-700">
                <input
                  type="radio"
                  name="systemType"
                  value="permeable"
                  checked={systemType === "permeable"}
                  onChange={() => setSystemType("permeable")}
                  className="mr-1"
                />
                Permeable (no underdrain)
              </label>
            </div>

            <CalcInput
              name="df"
              label={data.variables.df.label}
              unit={data.variables.df.unit}
              hint={data.variables.df.hint}
              value={df}
              onChange={setDf}
              min={0}
              error={dfError}
            />
            <CalcInput
              name="hf"
              label={data.variables.hf.label}
              unit={data.variables.hf.unit}
              hint={data.variables.hf.hint}
              value={hf}
              onChange={setHf}
              min={0}
              error={hfError}
            />
            <CalcInput
              name="tf"
              label={data.variables.tf.label}
              unit={data.variables.tf.unit}
              hint={data.variables.tf.hint}
              value={tf}
              onChange={setTf}
              min={0}
              error={tfError}
            />
            <CalcInput
              name="k"
              label={
                systemType === "impermeable"
                  ? "Filter Media Permeability (k)"
                  : "Underlying Soil Infiltration Rate (i)"
              }
              unit="m/day"
              hint={data.variables.k.hint}
              value={k}
              onChange={setK}
              min={0}
              error={kError}
            />

            {systemType === "impermeable" && (
              <div className="rounded-2xl bg-stone-50 border border-stone-200 p-3 text-xs text-stone-600 mb-3">
                <p className="font-semibold mb-1">Table 9.7 — Media permeability k (m/day):</p>
                <ul className="list-disc list-inside">
                  {BIORETENTION_PERMEABILITY.map((m) => (
                    <li key={m.media}>
                      {m.media}: {m.k_m_day}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {allValid && result && wqv !== null && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: data.formula,
                  inputs: [
                    { label: "Catchment Area", value: catchment, unit: "m²" },
                    { label: "Runoff Coefficient", value: runoffC, unit: "—" },
                    { label: "WQv (40 mm × A × C)", value: wqv.toFixed(3), unit: "m³" },
                    { label: "System Type", value: systemType, unit: "—" },
                    { label: "df", value: df, unit: "m" },
                    { label: "hf", value: hf, unit: "m" },
                    { label: "tf", value: tf, unit: "day" },
                    { label: "k or i", value: k, unit: "m/day" },
                  ],
                  result: {
                    label: "Filter Bed Area",
                    value: result.filterArea_m2.toFixed(2),
                    unit: "m²",
                  },
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            <CalcResult
              label="Water Quality Volume (WQv)"
              value={wqv}
              unit="m³"
            />
            <CalcResult
              label={data.result.Af.label}
              value={result?.filterArea_m2 ?? null}
              unit={data.result.Af.unit}
            />
            {result && result.filterArea_m2 > 0 && (
              <div className="rounded-2xl bg-stone-50 border border-stone-200 p-3 text-xs text-stone-600 space-y-1">
                <p>
                  <strong>Maximum emptying time:</strong>{" "}
                  {result.maxEmptyingTime_hrs.toFixed(1)} hrs
                  {result.maxEmptyingTime_hrs > 24 && " ⚠ exceeds 24 hr limit"}
                </p>
                <p>
                  <strong>Minimum dimensions check:</strong>{" "}
                  {result.meetsMinDimensions
                    ? "✓ Area ≥ 18 m² (3 m × 6 m min per Table 9.6)"
                    : "⚠ Area < 18 m² — adopt 3 m × 6 m minimum"}
                </p>
              </div>
            )}
            {result && result.notes.length > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                <p className="font-semibold mb-1">Design notes:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {result.notes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <Disclaimer text={data.disclaimer} />
      </div>

      {allValid && result && wqv !== null && (
        <PrintNote
          title={data.name}
          reference={data.reference}
          formula={data.formula}
          inputs={[
            { label: "Catchment Area", value: catchment, unit: "m²" },
            { label: "Runoff Coefficient", value: runoffC, unit: "—" },
            { label: "WQv", value: wqv.toFixed(3), unit: "m³" },
            { label: "System Type", value: systemType, unit: "—" },
            { label: "df / hf / tf", value: `${df} / ${hf} / ${tf}`, unit: "m / m / day" },
            { label: "k or i", value: k, unit: "m/day" },
          ]}
          result={{
            label: "Filter Bed Area",
            value: result.filterArea_m2.toFixed(2),
            unit: "m²",
          }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
