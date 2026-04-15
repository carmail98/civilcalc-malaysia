"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { slopeStability } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import KeyTerms from "@/components/KeyTerms";
import { keyTerms } from "@/data/key-terms";

const data = (formulaData as Record<string, any>).slope_stability;

export default function SlopeStabilityPage() {
  const [c, setC] = useState("");
  const [phi, setPhi] = useState("");
  const [gamma, setGamma] = useState("");
  const [z, setZ] = useState("");
  const [beta, setBeta] = useState("");
  const [waterTable, setWaterTable] = useState(false);
  const [gammaW, setGammaW] = useState("9.81");

  const cVal = parseFloat(c);
  const phiVal = parseFloat(phi);
  const gammaVal = parseFloat(gamma);
  const zVal = parseFloat(z);
  const betaVal = parseFloat(beta);
  const gammaWVal = parseFloat(gammaW);

  const { savedList, save, remove, clearAll, exportCalcs, importCalcs, isLoggedIn, syncing } = useCalcStorage("slope-stability");

  const allValid =
    !isNaN(cVal) && cVal >= 0 &&
    !isNaN(phiVal) && phiVal >= 0 &&
    (cVal > 0 || phiVal > 0) &&
    !isNaN(gammaVal) && gammaVal > 0 &&
    !isNaN(zVal) && zVal > 0 &&
    !isNaN(betaVal) && betaVal > 0 && betaVal < 90 &&
    !isNaN(gammaWVal) && gammaWVal > 0;

  const result = allValid
    ? slopeStability(cVal, phiVal, gammaVal, zVal, betaVal, waterTable, gammaWVal)
    : null;

  const statusColor = result
    ? result.FOS >= 1.5
      ? "border-green-200 bg-green-50 text-green-800"
      : result.FOS >= 1.3
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : result.FOS >= 1.0
      ? "border-orange-200 bg-orange-50 text-orange-800"
      : "border-red-200 bg-red-50 text-red-800"
    : "";

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: "Geotechnical", href: "/calculators/geotechnical" }, { label: "Slope Stability" }]} />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { c, phi, gamma, z, beta, waterTable: waterTable ? "true" : "false", gammaW })}
          onLoad={(v) => {
            setC(v.c ?? "");
            setPhi(v.phi ?? "");
            setGamma(v.gamma ?? "");
            setZ(v.z ?? "");
            setBeta(v.beta ?? "");
            setWaterTable(v.waterTable === "true");
            setGammaW(v.gammaW ?? "9.81");
          }}
          onRemove={remove}
          onExport={exportCalcs}
          onImport={importCalcs}
          isLoggedIn={isLoggedIn}
          syncing={syncing}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />

        <div className="grid gap-2 md:grid-cols-2 mb-6">
          {Object.entries(data.sub_formulas as Record<string, string>).map(([key, formula]) => (
            <div key={key} className="rounded-2xl bg-stone-50 border border-stone-200 p-3">
              <p className="text-sm font-mono text-stone-700">{formula}</p>
            </div>
          ))}
        </div>

        <KeyTerms terms={keyTerms["slope-stability"].terms} standard={keyTerms["slope-stability"].standard} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">Soil Properties</h3>
            <CalcInput name="c" label={data.variables.c.label} unit={data.variables.c.unit} hint={data.variables.c.hint} value={c} onChange={setC} min={0} />
            <CalcInput name="phi" label={data.variables.phi.label} unit={data.variables.phi.unit} hint={data.variables.phi.hint} value={phi} onChange={setPhi} min={0} />
            <CalcInput name="gamma" label={data.variables.gamma.label} unit={data.variables.gamma.unit} hint={data.variables.gamma.hint} value={gamma} onChange={setGamma} min={0} />

            <h3 className="text-sm font-semibold text-stone-600 mb-2 mt-6 uppercase tracking-wide">Slope Geometry</h3>
            <CalcInput name="z" label={data.variables.z.label} unit={data.variables.z.unit} hint={data.variables.z.hint} value={z} onChange={setZ} min={0} />
            <CalcInput name="beta" label={data.variables.beta.label} unit={data.variables.beta.unit} hint={data.variables.beta.hint} value={beta} onChange={setBeta} min={0} />

            <h3 className="text-sm font-semibold text-stone-600 mb-2 mt-6 uppercase tracking-wide">Water Condition</h3>
            <label className="flex items-center gap-3 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={waterTable}
                onChange={(e) => setWaterTable(e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-sm text-stone-700">Water table at failure surface</span>
            </label>
            {waterTable && (
              <CalcInput name="gammaW" label="Unit Weight of Water (gammaW)" unit="kN/m\u00B3" hint="Default 9.81 kN/m\u00B3" value={gammaW} onChange={setGammaW} min={0} />
            )}

            {allValid && result && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: data.formula,
                  inputs: [
                    { label: data.variables.c.label, value: c, unit: data.variables.c.unit },
                    { label: data.variables.phi.label, value: phi, unit: data.variables.phi.unit },
                    { label: data.variables.gamma.label, value: gamma, unit: data.variables.gamma.unit },
                    { label: data.variables.z.label, value: z, unit: data.variables.z.unit },
                    { label: data.variables.beta.label, value: beta, unit: data.variables.beta.unit },
                    { label: "Water Table", value: waterTable ? "Yes" : "No", unit: "" },
                  ],
                  result: {
                    label: "Factor of Safety",
                    value: result.FOS.toFixed(2),
                    unit: "",
                  },
                  additionalResults: [
                    { label: "Driving Force", value: result.drivingForce.toFixed(2), unit: "kN/m\u00B2" },
                    { label: "Resisting Force", value: result.resistingForce.toFixed(2), unit: "kN/m\u00B2" },
                    { label: "Status", value: result.status, unit: "" },
                  ],
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            {result ? (
              <>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">Forces</h3>
                <CalcResult label="Driving Force" value={result.drivingForce} unit="kN/m\u00B2" />
                <CalcResult label="Resisting Force" value={result.resistingForce} unit="kN/m\u00B2" />

                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 pt-2">Factor of Safety</h3>
                <CalcResult label={data.result.FOS.label} value={result.FOS} unit="" />

                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 pt-2">Stability Status</h3>
                <div className={`rounded-2xl border p-4 text-sm font-semibold ${statusColor}`}>
                  <p>FOS = {result.FOS.toFixed(2)}</p>
                  <p className="font-normal mt-1">{result.status}</p>
                </div>
              </>
            ) : (
              <>
                <CalcResult label="Driving Force" value={null} unit="kN/m\u00B2" />
                <CalcResult label="Resisting Force" value={null} unit="kN/m\u00B2" />
                <CalcResult label="Factor of Safety" value={null} unit="" />
              </>
            )}
          </div>
        </div>

        <Disclaimer text={data.disclaimer} />
      </div>

      {/* Print view */}
      {allValid && result && (
        <PrintNote
          title={data.name}
          reference={data.reference}
          formula={data.formula}
          inputs={[
            { label: data.variables.c.label, value: c, unit: data.variables.c.unit },
            { label: data.variables.phi.label, value: phi, unit: data.variables.phi.unit },
            { label: data.variables.gamma.label, value: gamma, unit: data.variables.gamma.unit },
            { label: data.variables.z.label, value: z, unit: data.variables.z.unit },
            { label: data.variables.beta.label, value: beta, unit: data.variables.beta.unit },
            { label: "Water Table", value: waterTable ? "Yes" : "No", unit: "" },
          ]}
          result={{ label: `FOS = ${result.FOS.toFixed(2)} | ${result.status}`, value: result.FOS.toFixed(2), unit: "" }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
