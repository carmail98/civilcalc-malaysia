"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { roadCarriagewayWidth } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";

const data = formulaData.road_width;

// ATJ 8/86 Table 3 — Lane widths (m)
const ruralLaneWidths: Record<string, Record<string, number>> = {
  R6: { flat: 3.65, rolling: 3.65, mountain: 3.5 },
  R5: { flat: 3.65, rolling: 3.5, mountain: 3.5 },
  R4: { flat: 3.5, rolling: 3.5, mountain: 3.25 },
  R3: { flat: 3.5, rolling: 3.25, mountain: 3.0 },
  R2: { flat: 3.25, rolling: 3.0, mountain: 3.0 },
  R1: { flat: 3.0, rolling: 3.0, mountain: 3.0 },
};

const urbanLaneWidths: Record<string, Record<string, number>> = {
  U6: { I: 3.65, II: 3.5, III: 3.5 },
  U5: { I: 3.5, II: 3.5, III: 3.25 },
  U4: { I: 3.5, II: 3.25, III: 3.25 },
  U3: { I: 3.25, II: 3.25, III: 3.0 },
  U2: { I: 3.25, II: 3.0, III: 3.0 },
  U1: { I: 3.0, II: 3.0, III: 3.0 },
};

const ruralClasses = Object.keys(ruralLaneWidths);
const urbanClasses = Object.keys(urbanLaneWidths);
const ruralTerrains = ["flat", "rolling", "mountain"];
const urbanTerrains = ["I", "II", "III"];

export default function RoadWidthPage() {
  const [roadType, setRoadType] = useState<"rural" | "urban">("rural");
  const [roadClass, setRoadClass] = useState("R4");
  const [terrain, setTerrain] = useState("flat");
  const [numLanes, setNumLanes] = useState("2");
  const [proposedWidth, setProposedWidth] = useState("");

  const nlVal = parseInt(numLanes);
  const pwVal = parseFloat(proposedWidth);

  const { savedList, save, remove, clearAll } = useCalcStorage("road-width");

  const nlError =
    numLanes !== "" && !isNaN(nlVal) && (nlVal < 1 || nlVal > 8)
      ? "Number of lanes must be 1–8"
      : undefined;
  const pwError =
    proposedWidth !== "" && !isNaN(pwVal) && pwVal <= 0
      ? "Width must be positive"
      : undefined;

  const hasErrors = !!nlError || !!pwError;

  // Get lane width from table
  const laneWidthTable =
    roadType === "rural" ? ruralLaneWidths : urbanLaneWidths;
  const laneWidth = laneWidthTable[roadClass]?.[terrain] ?? 0;

  const allValid =
    !isNaN(nlVal) &&
    !isNaN(pwVal) &&
    nlVal >= 1 &&
    pwVal > 0 &&
    laneWidth > 0 &&
    !hasErrors;

  const result = allValid
    ? roadCarriagewayWidth(laneWidth, nlVal, pwVal)
    : null;

  // Handle road type change
  const handleRoadTypeChange = (newType: "rural" | "urban") => {
    setRoadType(newType);
    if (newType === "rural") {
      setRoadClass("R4");
      setTerrain("flat");
    } else {
      setRoadClass("U4");
      setTerrain("I");
    }
  };

  const classes = roadType === "rural" ? ruralClasses : urbanClasses;
  const terrains = roadType === "rural" ? ruralTerrains : urbanTerrains;
  const terrainLabels =
    roadType === "rural"
      ? { flat: "Flat", rolling: "Rolling", mountain: "Mountainous" }
      : { I: "Area I", II: "Area II", III: "Area III" };

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: "Roads", href: "/calculators/roads" }, { label: "Carriageway Width" }]} />
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{data.name}</h1>
        <p className="text-sm text-gray-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { roadType, roadClass, terrain, numLanes, proposedWidth })}
          onLoad={(v) => { setRoadType((v.roadType as "rural" | "urban") ?? "rural"); setRoadClass(v.roadClass ?? "R4"); setTerrain(v.terrain ?? "flat"); setNumLanes(v.numLanes ?? "2"); setProposedWidth(v.proposedWidth ?? ""); }}
          onRemove={remove}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            {/* Road type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Road Type
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRoadTypeChange("rural")}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium border ${
                    roadType === "rural"
                      ? "bg-blue-50 border-blue-400 text-blue-700"
                      : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Rural (R1–R6)
                </button>
                <button
                  onClick={() => handleRoadTypeChange("urban")}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium border ${
                    roadType === "urban"
                      ? "bg-blue-50 border-blue-400 text-blue-700"
                      : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Urban (U1–U6)
                </button>
              </div>
            </div>

            {/* Road class */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Road Class
              </label>
              <select
                value={roadClass}
                onChange={(e) => setRoadClass(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500"
              >
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            {/* Terrain */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Terrain / Area
              </label>
              <select
                value={terrain}
                onChange={(e) => setTerrain(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500"
              >
                {terrains.map((t) => (
                  <option key={t} value={t}>
                    {terrainLabels[t as keyof typeof terrainLabels]}
                  </option>
                ))}
              </select>
            </div>

            <CalcInput
              name="numLanes"
              label="Number of Lanes"
              unit=""
              hint="Typical 1–8 lanes"
              value={numLanes}
              onChange={setNumLanes}
              min={1}
              max={8}
              error={nlError}
            />
            <CalcInput
              name="proposedWidth"
              label="Proposed Carriageway Width"
              unit="m"
              hint="Your proposed design width"
              value={proposedWidth}
              onChange={setProposedWidth}
              min={0}
              error={pwError}
            />

            {laneWidth > 0 && (
              <p className="mt-1 text-xs text-gray-500">
                Lane width from ATJ 8/86: <strong>{laneWidth} m</strong> ({roadClass}, {terrainLabels[terrain as keyof typeof terrainLabels]})
              </p>
            )}

            {allValid && result !== null && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: data.formula,
                  inputs: [
                    { label: "Road Type", value: roadType === "rural" ? "Rural" : "Urban", unit: "—" },
                    { label: "Road Class", value: roadClass, unit: "—" },
                    { label: "Terrain", value: terrainLabels[terrain as keyof typeof terrainLabels] ?? terrain, unit: "—" },
                    { label: "Lane Width (ATJ 8/86)", value: laneWidth.toString(), unit: "m" },
                    { label: "Number of Lanes", value: numLanes, unit: "—" },
                    { label: "Proposed Width", value: proposedWidth, unit: "m" },
                  ],
                  result: {
                    label: `Min Width: ${result.minWidth.toFixed(2)} m — ${result.pass ? "PASS" : "FAIL"}`,
                    value: `${pwVal} m ${result.pass ? "≥" : "<"} ${result.minWidth.toFixed(2)} m`,
                    unit: "",
                  },
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            <CalcResult
              label="Minimum Carriageway Width"
              value={result ? result.minWidth : null}
              unit="m"
            />
            <CalcResult
              label="Proposed Width"
              value={allValid ? pwVal : null}
              unit="m"
            />

            {result && (
              <div
                className={`rounded-lg border p-4 text-center text-lg font-bold ${
                  result.pass
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-red-200 bg-red-50 text-red-800"
                }`}
              >
                {result.pass ? "PASS" : "FAIL"} — {pwVal} m
                {result.pass ? " ≥ " : " < "}
                {result.minWidth.toFixed(2)} m required
              </div>
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
            { label: "Road Type", value: roadType === "rural" ? "Rural" : "Urban", unit: "—" },
            { label: "Road Class", value: roadClass, unit: "—" },
            { label: "Terrain", value: terrainLabels[terrain as keyof typeof terrainLabels] ?? terrain, unit: "—" },
            { label: "Lane Width (ATJ 8/86)", value: laneWidth.toString(), unit: "m" },
            { label: "Number of Lanes", value: numLanes, unit: "—" },
            { label: "Proposed Width", value: proposedWidth, unit: "m" },
          ]}
          result={{
            label: `Min Width: ${result.minWidth.toFixed(2)} m — ${result.pass ? "PASS" : "FAIL"}`,
            value: `${pwVal} m ${result.pass ? "≥" : "<"} ${result.minWidth.toFixed(2)} m`,
            unit: "",
          }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
