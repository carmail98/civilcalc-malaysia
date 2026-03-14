"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { flexiblePavement } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";

const data = formulaData.flexible_pavement;

export default function PavementPage() {
  const [adtCV, setAdtCV] = useState("");
  const [tf, setTf] = useState("");
  const [gr, setGr] = useState("");
  const [dp, setDp] = useState("");
  const [dd, setDd] = useState("0.5");
  const [ldf, setLdf] = useState("1.0");
  const [cbr, setCbr] = useState("");

  const adtVal = parseFloat(adtCV);
  const tfVal = parseFloat(tf);
  const grVal = parseFloat(gr);
  const dpVal = parseFloat(dp);
  const ddVal = parseFloat(dd);
  const ldfVal = parseFloat(ldf);
  const cbrVal = parseFloat(cbr);

  const { savedList, save, remove, clearAll } = useCalcStorage("flexible-pavement");

  // Validation
  const adtError =
    adtCV !== "" && !isNaN(adtVal) && adtVal <= 0
      ? "ADT must be positive"
      : undefined;

  const tfError =
    tf !== "" && !isNaN(tfVal)
      ? tfVal <= 0
        ? "Truck factor must be positive"
        : tfVal > 10
        ? "Truck factor unusually high (typical 1.0–5.0)"
        : undefined
      : undefined;

  const grError =
    gr !== "" && !isNaN(grVal)
      ? grVal < 0
        ? "Growth rate cannot be negative"
        : grVal > 15
        ? "Growth rate exceeds typical range"
        : undefined
      : undefined;

  const dpError =
    dp !== "" && !isNaN(dpVal)
      ? dpVal < 1
        ? "Design period must be at least 1 year"
        : dpVal > 30
        ? "Design period exceeds typical range (max 20–30 years)"
        : undefined
      : undefined;

  const ddError =
    dd !== "" && !isNaN(ddVal)
      ? ddVal <= 0 || ddVal > 1
        ? "DD must be between 0 and 1"
        : undefined
      : undefined;

  const ldfError =
    ldf !== "" && !isNaN(ldfVal)
      ? ldfVal <= 0 || ldfVal > 1
        ? "LDF must be between 0 and 1"
        : undefined
      : undefined;

  const cbrError =
    cbr !== "" && !isNaN(cbrVal)
      ? cbrVal < 1
        ? "CBR below 1% — subgrade may require stabilisation"
        : cbrVal > 30
        ? "CBR exceeds typical range"
        : undefined
      : undefined;

  const cbrWarning =
    cbr !== "" && !isNaN(cbrVal) && cbrVal >= 1 && cbrVal < 3
      ? "Low CBR — consider subgrade improvement or capping layer"
      : undefined;

  const hasErrors =
    !!adtError ||
    !!tfError ||
    !!grError ||
    !!dpError ||
    !!ddError ||
    !!ldfError ||
    !!cbrError;

  const allValid =
    !isNaN(adtVal) &&
    adtVal > 0 &&
    !isNaN(tfVal) &&
    tfVal > 0 &&
    !isNaN(grVal) &&
    grVal >= 0 &&
    !isNaN(dpVal) &&
    dpVal >= 1 &&
    !isNaN(ddVal) &&
    ddVal > 0 &&
    !isNaN(ldfVal) &&
    ldfVal > 0 &&
    !isNaN(cbrVal) &&
    cbrVal >= 1 &&
    !hasErrors;

  const result = allValid
    ? flexiblePavement(adtVal, tfVal, grVal, dpVal, ddVal, ldfVal, cbrVal)
    : null;

  // Format large ESAL number
  const formatESAL = (esal: number) => {
    if (esal >= 1e6) return `${(esal / 1e6).toFixed(2)} × 10⁶`;
    if (esal >= 1e3) return `${(esal / 1e3).toFixed(1)} × 10³`;
    return esal.toFixed(0);
  };

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: "Roads", href: "/calculators/roads" }, { label: "Pavement Design" }]} />
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{data.name}</h1>
        <p className="text-sm text-gray-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { adtCV, tf, gr, dp, dd, ldf, cbr })}
          onLoad={(v) => { setAdtCV(v.adtCV ?? ""); setTf(v.tf ?? ""); setGr(v.gr ?? ""); setDp(v.dp ?? ""); setDd(v.dd ?? "0.5"); setLdf(v.ldf ?? "1.0"); setCbr(v.cbr ?? ""); }}
          onRemove={remove}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />

        {/* Sub-formulas */}
        <div className="grid gap-2 md:grid-cols-2 mb-6">
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
            <p className="text-sm font-mono text-gray-700">
              {data.sub_formulas.growth_factor}
            </p>
            <p className="text-xs text-gray-400 mt-1">Growth Factor</p>
          </div>
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
            <p className="text-sm font-mono text-gray-700">
              {data.sub_formulas.traffic_category}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Pavement thickness lookup
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Traffic Data
            </h3>
            <CalcInput
              name="adtCV"
              label={data.variables.adtCommercial.label}
              unit={data.variables.adtCommercial.unit}
              hint={data.variables.adtCommercial.hint}
              value={adtCV}
              onChange={setAdtCV}
              min={0}
              error={adtError}
            />
            <CalcInput
              name="tf"
              label={data.variables.truckFactor.label}
              unit={data.variables.truckFactor.unit}
              hint={data.variables.truckFactor.hint}
              value={tf}
              onChange={setTf}
              min={0}
              error={tfError}
            />
            <CalcInput
              name="gr"
              label={data.variables.growthRate.label}
              unit={data.variables.growthRate.unit}
              hint={data.variables.growthRate.hint}
              value={gr}
              onChange={setGr}
              min={0}
              error={grError}
            />
            <CalcInput
              name="dp"
              label={data.variables.designPeriod.label}
              unit={data.variables.designPeriod.unit}
              hint={data.variables.designPeriod.hint}
              value={dp}
              onChange={setDp}
              min={1}
              error={dpError}
            />

            <h3 className="text-sm font-semibold text-gray-600 mb-2 mt-6 uppercase tracking-wide">
              Distribution Factors
            </h3>
            <CalcInput
              name="dd"
              label={data.variables.directionalDist.label}
              unit={data.variables.directionalDist.unit}
              hint={data.variables.directionalDist.hint}
              value={dd}
              onChange={setDd}
              min={0}
              max={1}
              error={ddError}
            />
            <CalcInput
              name="ldf"
              label={data.variables.laneDistFactor.label}
              unit={data.variables.laneDistFactor.unit}
              hint={data.variables.laneDistFactor.hint}
              value={ldf}
              onChange={setLdf}
              min={0}
              max={1}
              error={ldfError}
            />

            <h3 className="text-sm font-semibold text-gray-600 mb-2 mt-6 uppercase tracking-wide">
              Subgrade
            </h3>
            <CalcInput
              name="cbr"
              label={data.variables.cbr.label}
              unit={data.variables.cbr.unit}
              hint={data.variables.cbr.hint}
              value={cbr}
              onChange={setCbr}
              min={1}
              error={cbrError}
              warning={cbrWarning}
            />

            {allValid && result !== null && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: `${data.formula}  |  ${data.sub_formulas.growth_factor}`,
                  inputs: [
                    { label: data.variables.adtCommercial.label, value: adtCV, unit: data.variables.adtCommercial.unit },
                    { label: data.variables.truckFactor.label, value: tf, unit: data.variables.truckFactor.unit },
                    { label: data.variables.growthRate.label, value: gr, unit: data.variables.growthRate.unit },
                    { label: data.variables.designPeriod.label, value: dp, unit: data.variables.designPeriod.unit },
                    { label: data.variables.directionalDist.label, value: dd, unit: "—" },
                    { label: data.variables.laneDistFactor.label, value: ldf, unit: "—" },
                    { label: data.variables.cbr.label, value: cbr, unit: data.variables.cbr.unit },
                    { label: "Growth Factor (GF)", value: result.growthFactor.toFixed(4), unit: "—" },
                    { label: "Cumulative ESAL", value: formatESAL(result.cumulativeESAL), unit: "—" },
                    { label: "Traffic Category", value: `${result.tc} (${result.tcRange})`, unit: "—" },
                    { label: "AC Wearing Course", value: String(result.layers.acWearing), unit: "mm" },
                    { label: "AC Binder Course", value: String(result.layers.acBinder), unit: "mm" },
                    { label: "Crushed Aggregate Roadbase", value: String(result.layers.roadbase), unit: "mm" },
                    { label: "Crusher Run Subbase", value: String(result.layers.subbase), unit: "mm" },
                  ],
                  result: {
                    label: "Total Pavement Thickness",
                    value: String(result.layers.total),
                    unit: "mm",
                  },
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            {result !== null && (
              <>
                <CalcResult
                  label="Growth Factor (GF)"
                  value={result.growthFactor}
                  unit=""
                />
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm font-medium text-blue-900">
                    Cumulative ESAL
                  </p>
                  <p className="text-2xl font-bold text-blue-700 mt-1">
                    {formatESAL(result.cumulativeESAL)}
                  </p>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm font-medium text-blue-900">
                    Traffic Category
                  </p>
                  <p className="text-2xl font-bold text-blue-700 mt-1">
                    {result.tc}
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    ESAL range: {result.tcRange}
                  </p>
                </div>

                {/* Pavement layer table */}
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Recommended Pavement Structure
                  </h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-1 text-gray-600">Layer</th>
                        <th className="text-right py-1 text-gray-600">
                          Thickness
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-1.5 text-gray-800">
                          AC Wearing Course
                        </td>
                        <td className="py-1.5 text-right font-medium text-gray-900">
                          {result.layers.acWearing} mm
                        </td>
                      </tr>
                      {result.layers.acBinder > 0 && (
                        <tr className="border-b border-gray-100">
                          <td className="py-1.5 text-gray-800">
                            AC Binder Course
                          </td>
                          <td className="py-1.5 text-right font-medium text-gray-900">
                            {result.layers.acBinder} mm
                          </td>
                        </tr>
                      )}
                      <tr className="border-b border-gray-100">
                        <td className="py-1.5 text-gray-800">
                          Crushed Aggregate Roadbase
                        </td>
                        <td className="py-1.5 text-right font-medium text-gray-900">
                          {result.layers.roadbase} mm
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-1.5 text-gray-800">
                          Crusher Run Subbase
                        </td>
                        <td className="py-1.5 text-right font-medium text-gray-900">
                          {result.layers.subbase} mm
                        </td>
                      </tr>
                      <tr className="bg-gray-50 font-semibold">
                        <td className="py-2 text-gray-900">Total Pavement</td>
                        <td className="py-2 text-right text-blue-700">
                          {result.layers.total} mm
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* CBR advisory */}
                <div
                  className={`rounded-lg border p-3 text-sm ${
                    cbrVal < 3
                      ? "border-amber-200 bg-amber-50 text-amber-800"
                      : "border-green-200 bg-green-50 text-green-800"
                  }`}
                >
                  {result.layers.cbrNote}
                </div>
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
          formula={`${data.formula}  |  ${data.sub_formulas.growth_factor}`}
          inputs={[
            { label: data.variables.adtCommercial.label, value: adtCV, unit: data.variables.adtCommercial.unit },
            { label: data.variables.truckFactor.label, value: tf, unit: data.variables.truckFactor.unit },
            { label: data.variables.growthRate.label, value: gr, unit: data.variables.growthRate.unit },
            { label: data.variables.designPeriod.label, value: dp, unit: data.variables.designPeriod.unit },
            { label: data.variables.directionalDist.label, value: dd, unit: "—" },
            { label: data.variables.laneDistFactor.label, value: ldf, unit: "—" },
            { label: data.variables.cbr.label, value: cbr, unit: data.variables.cbr.unit },
            { label: "Growth Factor (GF)", value: result.growthFactor.toFixed(4), unit: "—" },
            { label: "Cumulative ESAL", value: formatESAL(result.cumulativeESAL), unit: "—" },
            { label: "Traffic Category", value: `${result.tc} (${result.tcRange})`, unit: "—" },
            { label: "AC Wearing Course", value: String(result.layers.acWearing), unit: "mm" },
            { label: "AC Binder Course", value: String(result.layers.acBinder), unit: "mm" },
            { label: "Crushed Aggregate Roadbase", value: String(result.layers.roadbase), unit: "mm" },
            { label: "Crusher Run Subbase", value: String(result.layers.subbase), unit: "mm" },
          ]}
          result={{
            label: "Total Pavement Thickness",
            value: String(result.layers.total),
            unit: "mm",
          }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
