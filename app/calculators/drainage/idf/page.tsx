"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import {
  rainfallIntensity,
  idfTable,
  IDF_PRESETS,
} from "@/lib/calcEngine";
import type { IDFConstants } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import KeyTerms from "@/components/KeyTerms";
import { keyTerms } from "@/data/key-terms";

const data = formulaData.idf_curve;

const ARI_LIST = [2, 5, 10, 20, 50, 100];
const DURATION_LIST = [5, 10, 15, 30, 60, 120, 180, 360];

export default function IDFPage() {
  const [station, setStation] = useState("kl");
  const [lambda, setLambda] = useState("");
  const [kappa, setKappa] = useState("");
  const [theta, setTheta] = useState("");
  const [eta, setEta] = useState("");
  const [ari, setAri] = useState("");
  const [duration, setDuration] = useState("");

  const isCustom = station === "custom";
  const preset = IDF_PRESETS[station];

  // Resolve constants
  const constants: IDFConstants = isCustom
    ? {
        lambda: parseFloat(lambda),
        kappa: parseFloat(kappa),
        theta: parseFloat(theta),
        eta: parseFloat(eta),
      }
    : preset.constants;

  const ariVal = parseFloat(ari);
  const durVal = parseFloat(duration);

  const { savedList, save, remove, clearAll } = useCalcStorage("idf-curve");

  // Validation
  const ariError =
    ari !== "" && !isNaN(ariVal) && ariVal <= 0
      ? "ARI must be positive"
      : undefined;

  const durError =
    duration !== "" && !isNaN(durVal)
      ? durVal <= 0
        ? "Duration must be positive"
        : durVal > 1440
        ? "Duration exceeds 24 hours"
        : undefined
      : undefined;

  const lambdaError =
    isCustom && lambda !== "" && !isNaN(constants.lambda) && constants.lambda <= 0
      ? "λ must be positive"
      : undefined;

  const kappaError =
    isCustom && kappa !== "" && !isNaN(constants.kappa) && constants.kappa <= 0
      ? "κ must be positive"
      : undefined;

  const thetaError =
    isCustom && theta !== "" && !isNaN(constants.theta) && constants.theta < 0
      ? "θ cannot be negative"
      : undefined;

  const etaError =
    isCustom && eta !== "" && !isNaN(constants.eta) && constants.eta <= 0
      ? "η must be positive"
      : undefined;

  const hasErrors =
    !!ariError || !!durError || !!lambdaError || !!kappaError || !!thetaError || !!etaError;

  const constantsValid = isCustom
    ? !isNaN(constants.lambda) &&
      constants.lambda > 0 &&
      !isNaN(constants.kappa) &&
      constants.kappa > 0 &&
      !isNaN(constants.theta) &&
      constants.theta >= 0 &&
      !isNaN(constants.eta) &&
      constants.eta > 0
    : true;

  const singleValid =
    constantsValid &&
    !isNaN(ariVal) &&
    ariVal > 0 &&
    !isNaN(durVal) &&
    durVal > 0 &&
    !hasErrors;

  const singleResult = singleValid
    ? rainfallIntensity(constants, ariVal, durVal)
    : null;

  // Full IDF table (only if constants are valid)
  const tableData = constantsValid
    ? idfTable(constants, ARI_LIST, DURATION_LIST)
    : [];

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: "Drainage", href: "/calculators/drainage" }, { label: "IDF Curve" }]} />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { station, lambda, kappa, theta, eta, ari, duration })}
          onLoad={(v) => { setStation(v.station ?? "kl"); setLambda(v.lambda ?? ""); setKappa(v.kappa ?? ""); setTheta(v.theta ?? ""); setEta(v.eta ?? ""); setAri(v.ari ?? ""); setDuration(v.duration ?? ""); }}
          onRemove={remove}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />
        <KeyTerms terms={keyTerms["idf-curve"].terms} standard={keyTerms["idf-curve"].standard} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            {/* Station selector */}
            <h3 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">
              Rainfall Station
            </h3>
            <select
              value={station}
              onChange={(e) => setStation(e.target.value)}
              className="w-full rounded-2xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 mb-4 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            >
              {Object.entries(IDF_PRESETS).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>

            {/* Custom constants */}
            {isCustom && (
              <>
                <h3 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">
                  IDF Constants
                </h3>
                <CalcInput
                  name="lambda"
                  label={data.variables.lambda.label}
                  unit={data.variables.lambda.unit}
                  hint={data.variables.lambda.hint}
                  value={lambda}
                  onChange={setLambda}
                  min={0}
                  error={lambdaError}
                />
                <CalcInput
                  name="kappa"
                  label={data.variables.kappa.label}
                  unit={data.variables.kappa.unit}
                  hint={data.variables.kappa.hint}
                  value={kappa}
                  onChange={setKappa}
                  min={0}
                  error={kappaError}
                />
                <CalcInput
                  name="theta"
                  label={data.variables.theta.label}
                  unit={data.variables.theta.unit}
                  hint={data.variables.theta.hint}
                  value={theta}
                  onChange={setTheta}
                  min={0}
                  error={thetaError}
                />
                <CalcInput
                  name="eta"
                  label={data.variables.eta.label}
                  unit={data.variables.eta.unit}
                  hint={data.variables.eta.hint}
                  value={eta}
                  onChange={setEta}
                  min={0}
                  error={etaError}
                />
              </>
            )}

            {/* Show active constants */}
            {!isCustom && (
              <div className="rounded-2xl bg-stone-50 border border-stone-200 p-3 mb-4">
                <p className="text-xs font-semibold text-stone-500 mb-1">
                  Active IDF Constants
                </p>
                <p className="text-sm font-mono text-stone-700">
                  λ = {constants.lambda} &nbsp; κ = {constants.kappa} &nbsp; θ ={" "}
                  {constants.theta} &nbsp; η = {constants.eta}
                </p>
              </div>
            )}

            {/* Single-point lookup */}
            <h3 className="text-sm font-semibold text-stone-600 mb-2 mt-4 uppercase tracking-wide">
              Single-Point Lookup
            </h3>
            <CalcInput
              name="ari"
              label={data.variables.ari.label}
              unit={data.variables.ari.unit}
              hint={data.variables.ari.hint}
              value={ari}
              onChange={setAri}
              min={0}
              error={ariError}
            />
            <CalcInput
              name="duration"
              label={data.variables.duration.label}
              unit={data.variables.duration.unit}
              hint={data.variables.duration.hint}
              value={duration}
              onChange={setDuration}
              min={0}
              error={durError}
            />

            {singleValid && singleResult !== null && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: data.formula,
                  inputs: [
                    { label: "Rainfall Station", value: preset.label, unit: "—" },
                    { label: "λ (Lambda)", value: String(constants.lambda), unit: "—" },
                    { label: "κ (Kappa)", value: String(constants.kappa), unit: "—" },
                    { label: "θ (Theta)", value: String(constants.theta), unit: "—" },
                    { label: "η (Eta)", value: String(constants.eta), unit: "—" },
                    { label: data.variables.ari.label, value: ari, unit: data.variables.ari.unit },
                    { label: data.variables.duration.label, value: duration, unit: data.variables.duration.unit },
                    { label: "Rainfall Depth", value: ((singleResult * durVal) / 60).toFixed(2), unit: "mm" },
                  ],
                  result: {
                    label: data.result.i.label,
                    value: singleResult.toFixed(2),
                    unit: data.result.i.unit,
                  },
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            {/* Single result */}
            <CalcResult
              label={data.result.i.label}
              value={singleResult}
              unit={data.result.i.unit}
            />

            {/* Rainfall depth */}
            {singleResult !== null && (
              <CalcResult
                label="Rainfall Depth"
                value={(singleResult * durVal) / 60}
                unit="mm"
              />
            )}

            {/* Note about presets */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Preset constants are representative values. Always verify with your
              local JPS/DID office or MSMA Appendix 2.B for site-specific
              constants.
            </div>
          </div>
        </div>

        {/* Full IDF Table */}
        {constantsValid && tableData.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-stone-700 mb-3">
              IDF Table — Intensity (mm/hr)
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200">
                    <th className="px-3 py-2 text-left text-stone-600 font-semibold">
                      Duration (min)
                    </th>
                    {ARI_LIST.map((a) => (
                      <th
                        key={a}
                        className="px-3 py-2 text-right text-stone-600 font-semibold"
                      >
                        {a}-yr
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DURATION_LIST.map((dur) => (
                    <tr
                      key={dur}
                      className="border-b border-stone-100 hover:bg-stone-50"
                    >
                      <td className="px-3 py-1.5 font-medium text-stone-700">
                        {dur}
                      </td>
                      {ARI_LIST.map((a) => {
                        const val = rainfallIntensity(constants, a, dur);
                        return (
                          <td
                            key={a}
                            className="px-3 py-1.5 text-right text-stone-700 font-mono"
                          >
                            {val.toFixed(1)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-stone-400 mt-2">
              Station: {preset.label} &nbsp;|&nbsp; λ={constants.lambda}, κ=
              {constants.kappa}, θ={constants.theta}, η={constants.eta}
            </p>
          </div>
        )}

        <Disclaimer text={data.disclaimer} />
      </div>

      {/* Print view */}
      {singleValid && singleResult !== null && (
        <PrintNote
          title={data.name}
          reference={data.reference}
          formula={data.formula}
          inputs={[
            {
              label: "Rainfall Station",
              value: preset.label,
              unit: "—",
            },
            {
              label: "λ (Lambda)",
              value: String(constants.lambda),
              unit: "—",
            },
            { label: "κ (Kappa)", value: String(constants.kappa), unit: "—" },
            { label: "θ (Theta)", value: String(constants.theta), unit: "—" },
            { label: "η (Eta)", value: String(constants.eta), unit: "—" },
            {
              label: data.variables.ari.label,
              value: ari,
              unit: data.variables.ari.unit,
            },
            {
              label: data.variables.duration.label,
              value: duration,
              unit: data.variables.duration.unit,
            },
            {
              label: "Rainfall Depth",
              value: ((singleResult * durVal) / 60).toFixed(2),
              unit: "mm",
            },
          ]}
          result={{
            label: data.result.i.label,
            value: singleResult.toFixed(2),
            unit: data.result.i.unit,
          }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
