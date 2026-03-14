"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { detentionPond } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";

const data = formulaData.detention_pond;

export default function DetentionPondPage() {
  const [area, setArea] = useState("");
  const [cPre, setCPre] = useState("");
  const [cPost, setCPost] = useState("");
  const [intensity, setIntensity] = useState("");
  const [duration, setDuration] = useState("");
  const [psd, setPsd] = useState("");

  const areaVal = parseFloat(area);
  const cPreVal = parseFloat(cPre);
  const cPostVal = parseFloat(cPost);
  const intVal = parseFloat(intensity);
  const durVal = parseFloat(duration);
  const psdVal = parseFloat(psd);

  const { savedList, save, remove, clearAll } = useCalcStorage("detention-pond");

  // Validation
  const areaError =
    area !== "" && !isNaN(areaVal) && areaVal <= 0
      ? "Area must be positive"
      : undefined;

  const cPreError =
    cPre !== "" && !isNaN(cPreVal)
      ? cPreVal < 0 || cPreVal > 1
        ? "Coefficient must be 0–1"
        : undefined
      : undefined;

  const cPostError =
    cPost !== "" && !isNaN(cPostVal)
      ? cPostVal < 0 || cPostVal > 1
        ? "Coefficient must be 0–1"
        : undefined
      : undefined;

  const cWarning =
    cPre !== "" &&
    cPost !== "" &&
    !isNaN(cPreVal) &&
    !isNaN(cPostVal) &&
    cPostVal <= cPreVal
      ? "Post-dev C should be higher than pre-dev C"
      : undefined;

  const intError =
    intensity !== "" && !isNaN(intVal) && intVal <= 0
      ? "Intensity must be positive"
      : undefined;

  const durError =
    duration !== "" && !isNaN(durVal)
      ? durVal <= 0
        ? "Duration must be positive"
        : durVal > 1440
        ? "Duration exceeds 24 hours"
        : undefined
      : undefined;

  const psdError =
    psd !== "" && !isNaN(psdVal) && psdVal < 0
      ? "PSD cannot be negative"
      : undefined;

  const hasErrors =
    !!areaError ||
    !!cPreError ||
    !!cPostError ||
    !!intError ||
    !!durError ||
    !!psdError;

  const allValid =
    !isNaN(areaVal) &&
    areaVal > 0 &&
    !isNaN(cPreVal) &&
    cPreVal >= 0 &&
    cPreVal <= 1 &&
    !isNaN(cPostVal) &&
    cPostVal > 0 &&
    cPostVal <= 1 &&
    !isNaN(intVal) &&
    intVal > 0 &&
    !isNaN(durVal) &&
    durVal > 0 &&
    !hasErrors;

  const result = allValid
    ? detentionPond(
        areaVal,
        cPreVal,
        cPostVal,
        intVal,
        durVal,
        psd !== "" && !isNaN(psdVal) && psdVal > 0 ? psdVal : undefined
      )
    : null;

  // Area threshold warning per MSMA
  const areaWarning =
    area !== "" && !isNaN(areaVal) && areaVal < 1
      ? "MSMA OSD typically required for developments > 1 ha"
      : undefined;

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{data.name}</h1>
        <p className="text-sm text-gray-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { area, cPre, cPost, intensity, duration, psd })}
          onLoad={(v) => { setArea(v.area ?? ""); setCPre(v.cPre ?? ""); setCPost(v.cPost ?? ""); setIntensity(v.intensity ?? ""); setDuration(v.duration ?? ""); setPsd(v.psd ?? ""); }}
          onRemove={remove}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />

        {/* Sub-formulas */}
        <div className="grid gap-2 md:grid-cols-2 mb-6">
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
            <p className="text-sm font-mono text-gray-700">
              {data.sub_formulas.q_pre}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Pre-development peak flow
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
            <p className="text-sm font-mono text-gray-700">
              {data.sub_formulas.q_post}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Post-development peak flow
            </p>
          </div>
        </div>

        {/* Tip box */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 mb-6">
          Try several storm durations to find the <strong>critical duration</strong> that
          gives the maximum required storage volume.
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Catchment Data
            </h3>
            <CalcInput
              name="area"
              label={data.variables.area.label}
              unit={data.variables.area.unit}
              hint={data.variables.area.hint}
              value={area}
              onChange={setArea}
              min={0}
              error={areaError}
              warning={areaWarning}
            />
            <CalcInput
              name="cPre"
              label={data.variables.cPre.label}
              unit={data.variables.cPre.unit}
              hint={data.variables.cPre.hint}
              value={cPre}
              onChange={setCPre}
              min={0}
              max={1}
              error={cPreError}
            />
            <CalcInput
              name="cPost"
              label={data.variables.cPost.label}
              unit={data.variables.cPost.unit}
              hint={data.variables.cPost.hint}
              value={cPost}
              onChange={setCPost}
              min={0}
              max={1}
              error={cPostError}
              warning={cWarning}
            />

            <h3 className="text-sm font-semibold text-gray-600 mb-2 mt-6 uppercase tracking-wide">
              Storm Parameters
            </h3>
            <CalcInput
              name="intensity"
              label={data.variables.intensity.label}
              unit={data.variables.intensity.unit}
              hint={data.variables.intensity.hint}
              value={intensity}
              onChange={setIntensity}
              min={0}
              error={intError}
            />
            <CalcInput
              name="duration"
              label={data.variables.stormDuration.label}
              unit={data.variables.stormDuration.unit}
              hint={data.variables.stormDuration.hint}
              value={duration}
              onChange={setDuration}
              min={0}
              error={durError}
            />

            <h3 className="text-sm font-semibold text-gray-600 mb-2 mt-6 uppercase tracking-wide">
              Outflow Control (Optional)
            </h3>
            <CalcInput
              name="psd"
              label={data.variables.psd.label}
              unit={data.variables.psd.unit}
              hint={data.variables.psd.hint}
              value={psd}
              onChange={setPsd}
              min={0}
              error={psdError}
            />

            {allValid && result !== null && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: `${data.formula}  |  ${data.sub_formulas.q_pre}  |  ${data.sub_formulas.q_post}`,
                  inputs: [
                    { label: data.variables.area.label, value: area, unit: data.variables.area.unit },
                    { label: data.variables.cPre.label, value: cPre, unit: "—" },
                    { label: data.variables.cPost.label, value: cPost, unit: "—" },
                    { label: data.variables.intensity.label, value: intensity, unit: data.variables.intensity.unit },
                    { label: data.variables.stormDuration.label, value: duration, unit: data.variables.stormDuration.unit },
                    { label: "PSD (Allowable Outflow)", value: result.psd.toFixed(4), unit: `m³/s (${result.psdSource})` },
                    { label: "Pre-Dev Peak Flow (Q_pre)", value: result.qPre.toFixed(4), unit: "m³/s" },
                    { label: "Post-Dev Peak Flow (Q_post)", value: result.qPost.toFixed(4), unit: "m³/s" },
                    { label: "Net Inflow (Q_post − PSD)", value: Math.max(0, result.qPost - result.psd).toFixed(4), unit: "m³/s" },
                  ],
                  result: {
                    label: data.result.V.label,
                    value: result.storageVolume.toFixed(1),
                    unit: data.result.V.unit,
                  },
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            {result !== null && (
              <>
                {/* Flow comparison table */}
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Flow Comparison
                  </h4>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-1.5 text-gray-600">
                          Pre-Dev Peak Flow (Q_pre)
                        </td>
                        <td className="py-1.5 text-right font-medium text-gray-900">
                          {result.qPre.toFixed(4)} m³/s
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-1.5 text-gray-600">
                          Post-Dev Peak Flow (Q_post)
                        </td>
                        <td className="py-1.5 text-right font-medium text-gray-900">
                          {result.qPost.toFixed(4)} m³/s
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-1.5 text-gray-600">
                          Flow Increase
                        </td>
                        <td className="py-1.5 text-right font-medium text-amber-700">
                          +{(result.qPost - result.qPre).toFixed(4)} m³/s
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="py-1.5 text-gray-600">
                          PSD (Allowable Outflow)
                        </td>
                        <td className="py-1.5 text-right font-medium text-gray-900">
                          {result.psd.toFixed(4)} m³/s
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-xs text-gray-400 mt-2">
                    PSD source: {result.psdSource}
                  </p>
                </div>

                {/* Net inflow */}
                <CalcResult
                  label="Net Inflow (Q_post − PSD)"
                  value={Math.max(0, result.qPost - result.psd)}
                  unit="m³/s"
                />

                {/* Main result */}
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm font-medium text-blue-900">
                    {data.result.V.label}
                  </p>
                  <p className="text-2xl font-bold text-blue-700 mt-1">
                    {result.storageVolume.toFixed(1)} m³
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    For {result.storageDuration} min storm duration
                  </p>
                </div>

                {/* No storage needed */}
                {result.storageVolume === 0 && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                    No detention storage required — post-dev flow does not
                    exceed PSD for this storm duration.
                  </div>
                )}

                {/* Storage volume context */}
                {result.storageVolume > 0 && (
                  <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Equivalent Dimensions (approximate)
                    </h4>
                    <p className="text-sm text-gray-600">
                      If pond depth = 1.5m:{" "}
                      <span className="font-medium text-gray-900">
                        {(result.storageVolume / 1.5).toFixed(0)} m²
                      </span>{" "}
                      surface area
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      If pond depth = 2.0m:{" "}
                      <span className="font-medium text-gray-900">
                        {(result.storageVolume / 2.0).toFixed(0)} m²
                      </span>{" "}
                      surface area
                    </p>
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
          formula={`${data.formula}  |  ${data.sub_formulas.q_pre}  |  ${data.sub_formulas.q_post}`}
          inputs={[
            { label: data.variables.area.label, value: area, unit: data.variables.area.unit },
            { label: data.variables.cPre.label, value: cPre, unit: "—" },
            { label: data.variables.cPost.label, value: cPost, unit: "—" },
            { label: data.variables.intensity.label, value: intensity, unit: data.variables.intensity.unit },
            { label: data.variables.stormDuration.label, value: duration, unit: data.variables.stormDuration.unit },
            { label: "PSD (Allowable Outflow)", value: result.psd.toFixed(4), unit: `m³/s (${result.psdSource})` },
            { label: "Pre-Dev Peak Flow (Q_pre)", value: result.qPre.toFixed(4), unit: "m³/s" },
            { label: "Post-Dev Peak Flow (Q_post)", value: result.qPost.toFixed(4), unit: "m³/s" },
            { label: "Net Inflow (Q_post − PSD)", value: Math.max(0, result.qPost - result.psd).toFixed(4), unit: "m³/s" },
          ]}
          result={{
            label: data.result.V.label,
            value: result.storageVolume.toFixed(1),
            unit: data.result.V.unit,
          }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
