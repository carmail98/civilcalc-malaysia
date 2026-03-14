"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { sewerPipeSizing } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";

const data = formulaData.sewer_sizing;

export default function SewerSizingPage() {
  const [pe, setPe] = useState("");
  const [pcf, setPcf] = useState("225");
  const [dia, setDia] = useState("");
  const [slope, setSlope] = useState("");
  const [n, setN] = useState("0.011");
  const [inf, setInf] = useState("0");

  const peVal = parseFloat(pe);
  const pcfVal = parseFloat(pcf);
  const diaVal = parseFloat(dia);
  const slopeVal = parseFloat(slope);
  const nVal = parseFloat(n);
  const infVal = parseFloat(inf);

  const { savedList, save, remove, clearAll } = useCalcStorage("sewer-pipe-sizing");

  // Validation
  const peError =
    pe !== "" && !isNaN(peVal) && peVal <= 0
      ? "PE must be positive"
      : undefined;

  const pcfError =
    pcf !== "" && !isNaN(pcfVal)
      ? pcfVal <= 0
        ? "Flow must be positive"
        : pcfVal > 400
        ? "Per capita flow exceeds typical range"
        : undefined
      : undefined;

  const diaError =
    dia !== "" && !isNaN(diaVal)
      ? diaVal < 100
        ? "Minimum pipe diameter is 100mm"
        : undefined
      : undefined;

  const diaWarning =
    dia !== "" && !isNaN(diaVal) && diaVal >= 100 && diaVal < 150
      ? "Below minimum 150mm for individual house connection"
      : dia !== "" && !isNaN(diaVal) && diaVal >= 150 && diaVal < 200
      ? "Below minimum 200mm for public sewer (MSIG)"
      : undefined;

  const slopeError =
    slope !== "" && !isNaN(slopeVal)
      ? slopeVal <= 0
        ? "Slope must be positive"
        : slopeVal > 0.1
        ? "Slope exceeds typical range"
        : undefined
      : undefined;

  const slopeWarning =
    slope !== "" &&
    !isNaN(slopeVal) &&
    dia !== "" &&
    !isNaN(diaVal) &&
    slopeVal > 0
      ? diaVal <= 150 && slopeVal < 1 / 200
        ? "Below min slope 1:200 for 150mm pipe (MSIG)"
        : diaVal > 150 && diaVal <= 200 && slopeVal < 1 / 250
        ? "Below min slope 1:250 for 200mm pipe (MSIG)"
        : diaVal > 200 && diaVal <= 300 && slopeVal < 1 / 350
        ? "Below min slope 1:350 for 300mm pipe"
        : undefined
      : undefined;

  const nError =
    n !== "" && !isNaN(nVal)
      ? nVal < 0.008
        ? "Manning n too low"
        : nVal > 0.02
        ? "Manning n exceeds typical sewer range"
        : undefined
      : undefined;

  const infError =
    inf !== "" && !isNaN(infVal) && infVal < 0
      ? "Infiltration cannot be negative"
      : undefined;

  const hasErrors =
    !!peError || !!pcfError || !!diaError || !!slopeError || !!nError || !!infError;

  const allValid =
    !isNaN(peVal) &&
    peVal > 0 &&
    !isNaN(pcfVal) &&
    pcfVal > 0 &&
    !isNaN(diaVal) &&
    diaVal >= 100 &&
    !isNaN(slopeVal) &&
    slopeVal > 0 &&
    !isNaN(nVal) &&
    nVal > 0 &&
    !isNaN(infVal) &&
    infVal >= 0 &&
    !hasErrors;

  const result = allValid
    ? sewerPipeSizing(peVal, pcfVal, diaVal, slopeVal, nVal, infVal)
    : null;

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: "Sewerage" }, { label: "Sewer Pipe Sizing" }]} />
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{data.name}</h1>
        <p className="text-sm text-gray-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { pe, pcf, dia, slope, n, inf })}
          onLoad={(v) => { setPe(v.pe ?? ""); setPcf(v.pcf ?? "225"); setDia(v.dia ?? ""); setSlope(v.slope ?? ""); setN(v.n ?? "0.011"); setInf(v.inf ?? "0"); }}
          onRemove={remove}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />

        {/* Sub-formulas */}
        <div className="grid gap-2 md:grid-cols-3 mb-6">
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
            <p className="text-sm font-mono text-gray-700">
              {data.sub_formulas.dwf}
            </p>
            <p className="text-xs text-gray-400 mt-1">Dry Weather Flow</p>
          </div>
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
            <p className="text-sm font-mono text-gray-700">
              {data.sub_formulas.harmon}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Harmon&apos;s Peak Factor
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
            <p className="text-sm font-mono text-gray-700">
              {data.sub_formulas.pipe}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Manning&apos;s full flow
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Sewage Flow
            </h3>
            <CalcInput
              name="pe"
              label={data.variables.PE.label}
              unit={data.variables.PE.unit}
              hint={data.variables.PE.hint}
              value={pe}
              onChange={setPe}
              min={0}
              error={peError}
            />
            <CalcInput
              name="pcf"
              label={data.variables.perCapitaFlow.label}
              unit={data.variables.perCapitaFlow.unit}
              hint={data.variables.perCapitaFlow.hint}
              value={pcf}
              onChange={setPcf}
              min={0}
              error={pcfError}
            />
            <CalcInput
              name="inf"
              label={data.variables.infiltration.label}
              unit={data.variables.infiltration.unit}
              hint={data.variables.infiltration.hint}
              value={inf}
              onChange={setInf}
              min={0}
              error={infError}
            />

            <h3 className="text-sm font-semibold text-gray-600 mb-2 mt-6 uppercase tracking-wide">
              Pipe Properties
            </h3>
            <CalcInput
              name="dia"
              label={data.variables.pipeDia.label}
              unit={data.variables.pipeDia.unit}
              hint={data.variables.pipeDia.hint}
              value={dia}
              onChange={setDia}
              min={100}
              error={diaError}
              warning={diaWarning}
            />
            <CalcInput
              name="slope"
              label={data.variables.pipeSlope.label}
              unit={data.variables.pipeSlope.unit}
              hint={data.variables.pipeSlope.hint}
              value={slope}
              onChange={setSlope}
              min={0}
              error={slopeError}
              warning={slopeWarning}
            />
            <CalcInput
              name="n"
              label={data.variables.manningN.label}
              unit={data.variables.manningN.unit}
              hint={data.variables.manningN.hint}
              value={n}
              onChange={setN}
              min={0.008}
              max={0.02}
              error={nError}
            />

            {allValid && result !== null && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: `${data.formula}  |  ${data.sub_formulas.dwf}  |  ${data.sub_formulas.harmon}`,
                  inputs: [
                    { label: data.variables.PE.label, value: pe, unit: data.variables.PE.unit },
                    { label: data.variables.perCapitaFlow.label, value: pcf, unit: data.variables.perCapitaFlow.unit },
                    { label: data.variables.infiltration.label, value: inf, unit: data.variables.infiltration.unit },
                    { label: data.variables.pipeDia.label, value: dia, unit: data.variables.pipeDia.unit },
                    { label: data.variables.pipeSlope.label, value: slope, unit: data.variables.pipeSlope.unit },
                    { label: data.variables.manningN.label, value: n, unit: "—" },
                    { label: "Dry Weather Flow", value: result.dwf.toFixed(3), unit: "L/s" },
                    { label: "Peak Factor (Harmon's)", value: result.peakFactor.toFixed(2), unit: "—" },
                    { label: "Peak Flow", value: result.peakFlow.toFixed(3), unit: "L/s" },
                    { label: "Design Flow", value: result.designFlow.toFixed(3), unit: "L/s" },
                    { label: "Full-Flow Velocity", value: result.fullFlowVelocity.toFixed(3), unit: "m/s" },
                    { label: "Flow Ratio", value: `${(result.flowRatio * 100).toFixed(1)}%`, unit: result.adequate ? "ADEQUATE" : "INADEQUATE" },
                    { label: "Self-Cleansing", value: result.selfCleansing ? "OK" : "FAIL", unit: `V = ${result.fullFlowVelocity.toFixed(2)} m/s` },
                  ],
                  result: {
                    label: data.result.Qfull.label,
                    value: result.fullFlowCapacity.toFixed(3),
                    unit: data.result.Qfull.unit,
                  },
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            {result !== null && (
              <>
                {/* Flow breakdown */}
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Flow Calculation
                  </h4>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-1.5 text-gray-600">
                          Dry Weather Flow (DWF)
                        </td>
                        <td className="py-1.5 text-right font-medium text-gray-900">
                          {result.dwf.toFixed(3)} L/s
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-1.5 text-gray-600">
                          Peak Factor (Harmon&apos;s)
                        </td>
                        <td className="py-1.5 text-right font-medium text-gray-900">
                          {result.peakFactor.toFixed(2)}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-1.5 text-gray-600">Peak Flow</td>
                        <td className="py-1.5 text-right font-medium text-gray-900">
                          {result.peakFlow.toFixed(3)} L/s
                        </td>
                      </tr>
                      {result.infiltrationFlow > 0 && (
                        <tr className="border-b border-gray-100">
                          <td className="py-1.5 text-gray-600">
                            Infiltration
                          </td>
                          <td className="py-1.5 text-right font-medium text-gray-900">
                            {result.infiltrationFlow.toFixed(3)} L/s
                          </td>
                        </tr>
                      )}
                      <tr className="bg-blue-50 font-semibold">
                        <td className="py-2 text-blue-900">Design Flow</td>
                        <td className="py-2 text-right text-blue-700">
                          {result.designFlow.toFixed(3)} L/s
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Pipe capacity */}
                <CalcResult
                  label="Pipe Full Capacity"
                  value={result.fullFlowCapacity}
                  unit="L/s"
                />
                <CalcResult
                  label="Full-Flow Velocity"
                  value={result.fullFlowVelocity}
                  unit="m/s"
                />

                {/* d/D ratio */}
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <p className="text-sm font-medium text-gray-700">
                    Flow Ratio (Q_design / Q_full)
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {(result.flowRatio * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    MSIG max 80% full for gravity sewer
                  </p>
                </div>

                {/* Adequacy check */}
                <div
                  className={`rounded-lg border p-3 text-sm ${
                    result.adequate
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-red-200 bg-red-50 text-red-800"
                  }`}
                >
                  {result.adequate
                    ? "ADEQUATE — Flow ratio ≤ 80% (pipe not surcharging)"
                    : "INADEQUATE — Flow ratio > 80%, increase pipe diameter or slope"}
                </div>

                {/* Self-cleansing check */}
                <div
                  className={`rounded-lg border p-3 text-sm ${
                    result.selfCleansing
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-amber-200 bg-amber-50 text-amber-800"
                  }`}
                >
                  {result.selfCleansing
                    ? `Self-cleansing OK — V = ${result.fullFlowVelocity.toFixed(2)} m/s ≥ 0.6 m/s`
                    : `Self-cleansing FAIL — V = ${result.fullFlowVelocity.toFixed(2)} m/s < 0.6 m/s, increase slope`}
                </div>

                {/* Velocity cap warning */}
                {result.fullFlowVelocity > 3.0 && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                    Velocity exceeds 3.0 m/s — risk of pipe erosion, consider
                    reducing slope or adding drop manholes
                  </div>
                )}
              </>
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
          formula={`${data.formula}  |  ${data.sub_formulas.dwf}  |  ${data.sub_formulas.harmon}`}
          inputs={[
            { label: data.variables.PE.label, value: pe, unit: data.variables.PE.unit },
            { label: data.variables.perCapitaFlow.label, value: pcf, unit: data.variables.perCapitaFlow.unit },
            { label: data.variables.infiltration.label, value: inf, unit: data.variables.infiltration.unit },
            { label: data.variables.pipeDia.label, value: dia, unit: data.variables.pipeDia.unit },
            { label: data.variables.pipeSlope.label, value: slope, unit: data.variables.pipeSlope.unit },
            { label: data.variables.manningN.label, value: n, unit: "—" },
            { label: "Dry Weather Flow", value: result.dwf.toFixed(3), unit: "L/s" },
            { label: "Peak Factor (Harmon's)", value: result.peakFactor.toFixed(2), unit: "—" },
            { label: "Peak Flow", value: result.peakFlow.toFixed(3), unit: "L/s" },
            { label: "Design Flow", value: result.designFlow.toFixed(3), unit: "L/s" },
            { label: "Full-Flow Velocity", value: result.fullFlowVelocity.toFixed(3), unit: "m/s" },
            { label: "Flow Ratio", value: `${(result.flowRatio * 100).toFixed(1)}%`, unit: result.adequate ? "ADEQUATE" : "INADEQUATE" },
            { label: "Self-Cleansing", value: result.selfCleansing ? "OK" : "FAIL", unit: `V = ${result.fullFlowVelocity.toFixed(2)} m/s` },
          ]}
          result={{
            label: data.result.Qfull.label,
            value: result.fullFlowCapacity.toFixed(3),
            unit: data.result.Qfull.unit,
          }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
