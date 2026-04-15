"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { eiaScreening } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import KeyTerms from "@/components/KeyTerms";
import { keyTerms } from "@/data/key-terms";

const data = (formulaData as Record<string, any>).eia_screening;

const PROJECT_TYPE_OPTIONS = [
  { value: "", label: "-- Select project type --" },
  { value: "housing", label: "Housing Development" },
  { value: "resort_commercial", label: "Resort / Commercial" },
  { value: "industrial", label: "Industrial Estate / Zone" },
  { value: "infrastructure_road", label: "Infrastructure (Road)" },
  { value: "quarry_mining", label: "Quarry / Mining" },
  { value: "land_reclamation", label: "Land Reclamation" },
  { value: "dam", label: "Dam (Irrigation / Hydroelectric)" },
  { value: "waste_management", label: "Waste Management Facility" },
  { value: "agriculture", label: "Agriculture / Land Clearing" },
  { value: "hospital", label: "Hospital / Medical Institution" },
];

/** Hints about which numeric inputs are relevant per project type */
const INPUT_HINTS: Record<string, string> = {
  housing: "Uses: Site Area (ha) and Number of Units",
  resort_commercial: "Uses: Site Area (ha)",
  industrial: "Uses: Site Area (ha)",
  infrastructure_road: "Uses: Road Length (km)",
  quarry_mining: "Uses: Site Area (ha)",
  land_reclamation: "Uses: Site Area (ha)",
  dam: "EIA always required for all dam projects",
  waste_management: "EIA always required for all waste facilities",
  agriculture: "Uses: Site Area (ha)",
  hospital: "Uses: Number of Beds (enter in Units field)",
};

export default function EiaScreeningPage() {
  const [projectType, setProjectType] = useState("");
  const [siteArea, setSiteArea] = useState("");
  const [units, setUnits] = useState("");
  const [roadLength, setRoadLength] = useState("");

  const areaVal = parseFloat(siteArea);
  const unitsVal = parseFloat(units);
  const roadVal = parseFloat(roadLength);

  const { savedList, save, remove, clearAll, exportCalcs, importCalcs, isLoggedIn, syncing } = useCalcStorage("eia-screening");

  // Validation
  const areaError =
    siteArea !== "" && !isNaN(areaVal) && areaVal < 0
      ? "Site area cannot be negative"
      : undefined;

  const unitsError =
    units !== "" && !isNaN(unitsVal) && unitsVal < 0
      ? "Number of units cannot be negative"
      : undefined;

  const roadError =
    roadLength !== "" && !isNaN(roadVal) && roadVal < 0
      ? "Road length cannot be negative"
      : undefined;

  const hasErrors = !!areaError || !!unitsError || !!roadError;

  const allValid =
    projectType !== "" &&
    !isNaN(areaVal) &&
    areaVal >= 0 &&
    !isNaN(unitsVal) &&
    unitsVal >= 0 &&
    !isNaN(roadVal) &&
    roadVal >= 0 &&
    !hasErrors;

  const result = allValid
    ? eiaScreening(projectType, areaVal, unitsVal, roadVal)
    : null;

  // Status colour logic
  const statusColor = result
    ? !result.requiresEIA
      ? "border-green-300 bg-green-50"
      : result.eiaType.includes("Detailed")
      ? "border-red-300 bg-red-50"
      : "border-amber-300 bg-amber-50"
    : "";

  const statusTextColor = result
    ? !result.requiresEIA
      ? "text-green-800"
      : result.eiaType.includes("Detailed")
      ? "text-red-800"
      : "text-amber-800"
    : "";

  const statusBadgeBg = result
    ? !result.requiresEIA
      ? "bg-green-600"
      : result.eiaType.includes("Detailed")
      ? "bg-red-600"
      : "bg-amber-500"
    : "";

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: "Environmental", href: "/calculators/environmental" }, { label: "EIA Screening" }]} />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { projectType, siteArea, units, roadLength })}
          onLoad={(v) => {
            setProjectType(v.projectType ?? "");
            setSiteArea(v.siteArea ?? "");
            setUnits(v.units ?? "");
            setRoadLength(v.roadLength ?? "");
          }}
          onRemove={remove}
          onExport={exportCalcs}
          onImport={importCalcs}
          isLoggedIn={isLoggedIn}
          syncing={syncing}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />
        <KeyTerms terms={keyTerms["eia-screening"].terms} standard={keyTerms["eia-screening"].standard} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            {/* Project type select */}
            <div className="mb-4">
              <label
                htmlFor="projectType"
                className="block text-sm font-medium text-stone-700 mb-1"
              >
                Project Type
              </label>
              <select
                id="projectType"
                name="projectType"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:border-amber-500 focus:ring-amber-500 bg-white"
              >
                {PROJECT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {projectType && INPUT_HINTS[projectType] && (
                <p className="mt-1 text-xs text-amber-600">{INPUT_HINTS[projectType]}</p>
              )}
            </div>

            <CalcInput
              name="siteArea"
              label={data.variables.siteArea.label}
              unit={data.variables.siteArea.unit}
              hint={data.variables.siteArea.hint}
              value={siteArea}
              onChange={setSiteArea}
              min={0}
              error={areaError}
            />
            <CalcInput
              name="units"
              label={data.variables.units.label}
              unit={data.variables.units.unit}
              hint={data.variables.units.hint}
              value={units}
              onChange={setUnits}
              min={0}
              error={unitsError}
            />
            <CalcInput
              name="roadLength"
              label={data.variables.roadLength.label}
              unit={data.variables.roadLength.unit}
              hint={data.variables.roadLength.hint}
              value={roadLength}
              onChange={setRoadLength}
              min={0}
              error={roadError}
            />

            {allValid && result !== null && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: data.formula,
                  inputs: [
                    { label: "Project Type", value: PROJECT_TYPE_OPTIONS.find((o) => o.value === projectType)?.label ?? projectType, unit: "\u2014" },
                    { label: data.variables.siteArea.label, value: siteArea, unit: data.variables.siteArea.unit },
                    { label: data.variables.units.label, value: units, unit: data.variables.units.unit || "\u2014" },
                    { label: data.variables.roadLength.label, value: roadLength, unit: data.variables.roadLength.unit },
                  ],
                  result: {
                    label: "EIA Requirement",
                    value: result.eiaType,
                    unit: result.requiresEIA ? "REQUIRED" : "NOT REQUIRED",
                  },
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            {result !== null && (
              <>
                {/* Status box */}
                <div className={`rounded-2xl border-2 p-5 ${statusColor}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${statusBadgeBg}`}>
                      {result.requiresEIA ? "EIA REQUIRED" : "NOT REQUIRED"}
                    </span>
                  </div>
                  <p className={`text-xl font-bold ${statusTextColor}`}>
                    {result.eiaType}
                  </p>
                </div>

                {/* Details table */}
                <div className="rounded-2xl border border-stone-200 bg-white p-4">
                  <h4 className="text-sm font-semibold text-stone-700 mb-3">
                    Screening Details
                  </h4>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-stone-100">
                        <td className="py-2 text-stone-600 font-medium">Category</td>
                        <td className="py-2 text-right text-stone-800">
                          {PROJECT_TYPE_OPTIONS.find((o) => o.value === result.category)?.label ?? result.category}
                        </td>
                      </tr>
                      <tr className="border-b border-stone-100">
                        <td className="py-2 text-stone-600 font-medium">Requires EIA</td>
                        <td className={`py-2 text-right font-bold ${result.requiresEIA ? "text-red-700" : "text-green-700"}`}>
                          {result.requiresEIA ? "Yes" : "No"}
                        </td>
                      </tr>
                      <tr className="border-b border-stone-100">
                        <td className="py-2 text-stone-600 font-medium">EIA Type</td>
                        <td className={`py-2 text-right font-medium ${statusTextColor}`}>
                          {result.eiaType}
                        </td>
                      </tr>
                      <tr className="border-b border-stone-100">
                        <td className="py-2 text-stone-600 font-medium">Threshold</td>
                        <td className="py-2 text-right text-stone-800 text-xs">
                          {result.threshold}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-stone-600 font-medium">Remarks</td>
                        <td className="py-2 text-right text-stone-700 text-xs">
                          {result.remarks}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Advisory note */}
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs text-stone-500">
                  This screening is based on the EIA Order 2015 (Prescribed Activities) thresholds.
                  State-level EPU requirements and environmentally sensitive area (ESA) classifications
                  may impose additional requirements. Always consult DOE and a registered EIA consultant.
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
          formula={data.formula}
          inputs={[
            { label: "Project Type", value: PROJECT_TYPE_OPTIONS.find((o) => o.value === projectType)?.label ?? projectType, unit: "\u2014" },
            { label: data.variables.siteArea.label, value: siteArea, unit: data.variables.siteArea.unit },
            { label: data.variables.units.label, value: units, unit: data.variables.units.unit || "\u2014" },
            { label: data.variables.roadLength.label, value: roadLength, unit: data.variables.roadLength.unit },
            { label: "EIA Requirement", value: result.eiaType, unit: result.requiresEIA ? "REQUIRED" : "NOT REQUIRED" },
            { label: "Threshold", value: result.threshold, unit: "\u2014" },
            { label: "Remarks", value: result.remarks, unit: "\u2014" },
          ]}
          result={{
            label: "EIA Requirement",
            value: result.eiaType,
            unit: result.requiresEIA ? "REQUIRED" : "NOT REQUIRED",
          }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
