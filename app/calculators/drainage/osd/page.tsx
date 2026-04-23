"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { osdSimplified } from "@/lib/calcEngine";
import { OSD_REGIONS, OSD_TERRAIN, type OsdRegion, type TerrainSlope } from "@/lib/msmaReferences";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";

const data = formulaData.osd;

export default function OsdPage() {
  const [region, setRegion] = useState<OsdRegion>("west");
  const [terrain, setTerrain] = useState<TerrainSlope>("mild");
  const [imperv, setImperv] = useState("");
  const [area, setArea] = useState("");

  const impervVal = parseFloat(imperv);
  const areaVal = parseFloat(area);

  const { savedList, save, remove, clearAll, exportCalcs, importCalcs, isLoggedIn, syncing } =
    useCalcStorage("osd");

  const impervError =
    imperv !== "" && !isNaN(impervVal)
      ? impervVal < 0
        ? "Impervious % cannot be negative"
        : impervVal > 100
        ? "Impervious % cannot exceed 100"
        : undefined
      : undefined;

  const impervWarning =
    imperv !== "" && !isNaN(impervVal) && (impervVal < 25 || impervVal > 90)
      ? "MSMA Table 5.A1 tabulates 25 %–90 % — values outside this range are extrapolated to the nearest band"
      : undefined;

  const areaError =
    area !== "" && !isNaN(areaVal) && areaVal <= 0
      ? "Project area must be positive"
      : undefined;

  const areaWarning =
    area !== "" && !isNaN(areaVal) && areaVal < 0.1
      ? "Site < 0.1 ha — MSMA §5.2.1 allows individual OSD but community OSD not required"
      : undefined;

  const hasErrors = !!impervError || !!areaError;
  const allValid =
    !isNaN(impervVal) && !isNaN(areaVal) && areaVal > 0 && impervVal >= 0 && !hasErrors;

  const result = allValid ? osdSimplified(region, terrain, impervVal, areaVal) : null;

  const regionLabel = OSD_REGIONS.find((r) => r.value === region)?.label ?? "";
  const terrainLabel = OSD_TERRAIN.find((t) => t.value === terrain)?.label ?? "";

  return (
    <>
      <div className="print:hidden">
        <Breadcrumbs
          items={[
            { label: "Drainage", href: "/calculators/drainage" },
            { label: "On-Site Detention (OSD)" },
          ]}
        />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-800">
          <p>
            This simplified procedure uses MSMA 2nd Edition Table 5.A1 (Five Design Regions).
            Values are linearly interpolated across impervious bands (25, 40, 50, 75, 90 %). For
            sites in one of the 18 major towns listed in Table 5.A2, town-specific values should
            be preferred. Design storm ARI is 10-year per §5.8.1(a).
          </p>
        </div>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { region, terrain, imperv, area })}
          onLoad={(v) => {
            setRegion((v.region as OsdRegion) ?? "west");
            setTerrain((v.terrain as TerrainSlope) ?? "mild");
            setImperv(v.imperv ?? "");
            setArea(v.area ?? "");
          }}
          onRemove={remove}
          onExport={exportCalcs}
          onImport={importCalcs}
          onReset={() => {
            setRegion("west");
            setTerrain("mild");
            setImperv("");
            setArea("");
          }}
          isLoggedIn={isLoggedIn}
          syncing={syncing}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">
              Design Region (Fig 5.A1)
            </h3>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as OsdRegion)}
              aria-label="Design Region"
              title="Design Region"
              className="w-full rounded-2xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 mb-1 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            >
              {OSD_REGIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-stone-400 mb-4">
              {OSD_REGIONS.find((r) => r.value === region)?.description}
            </p>

            <h3 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">
              Terrain / Slope
            </h3>
            <select
              value={terrain}
              onChange={(e) => setTerrain(e.target.value as TerrainSlope)}
              aria-label="Terrain / Slope"
              title="Terrain / Slope"
              className="w-full rounded-2xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 mb-1 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            >
              {OSD_TERRAIN.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-stone-400 mb-4">
              {OSD_TERRAIN.find((t) => t.value === terrain)?.range}
            </p>

            <CalcInput
              name="imperv"
              label={data.variables.imperviousPct.label}
              unit={data.variables.imperviousPct.unit}
              hint={data.variables.imperviousPct.hint}
              value={imperv}
              onChange={setImperv}
              min={0}
              max={100}
              error={impervError}
              warning={impervWarning}
            />
            <CalcInput
              name="area"
              label={data.variables.projectArea.label}
              unit={data.variables.projectArea.unit}
              hint={data.variables.projectArea.hint}
              value={area}
              onChange={setArea}
              min={0}
              error={areaError}
              warning={areaWarning}
            />

            {allValid && result && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: data.formula,
                  inputs: [
                    { label: "Design Region", value: regionLabel, unit: "—" },
                    { label: "Terrain", value: terrainLabel, unit: "—" },
                    { label: "Impervious Area", value: imperv, unit: "%" },
                    { label: "Project Area", value: area, unit: "ha" },
                    { label: "PSD/ha (Table 5.A1)", value: result.psd_lpsHa.toFixed(1), unit: "L/s/ha" },
                    { label: "SSR/ha (Table 5.A1)", value: result.ssr_m3Ha.toFixed(1), unit: "m³/ha" },
                    { label: "Design ARI", value: "10", unit: "year" },
                  ],
                  result: {
                    label: "Permissible Site Discharge",
                    value: result.psd_Ls.toFixed(1),
                    unit: "L/s",
                  },
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            <CalcResult
              label="Permissible Site Discharge (PSD)"
              value={result?.psd_Ls ?? null}
              unit="L/s"
            />
            <CalcResult
              label="PSD (m³/s)"
              value={result?.psd_m3s ?? null}
              unit="m³/s"
            />
            <CalcResult
              label="Site Storage Requirement (SSR)"
              value={result?.ssr_m3 ?? null}
              unit="m³"
            />
            <CalcResult
              label="SSR with 20 % landscape allowance (§5.3.1)"
              value={result?.ssrWith20pctAllowance_m3 ?? null}
              unit="m³"
            />

            {result && (
              <div className="rounded-2xl bg-stone-50 border border-stone-200 p-3 text-xs text-stone-600 space-y-1">
                <p>
                  <strong>Per-hectare values (Table 5.A1):</strong>
                </p>
                <p>
                  PSD = {result.psd_lpsHa.toFixed(1)} L/s/ha &nbsp;|&nbsp; SSR ={" "}
                  {result.ssr_m3Ha.toFixed(1)} m³/ha
                </p>
                <p className="mt-1 text-stone-500">
                  Design ARI = 10 yr (minor drainage system, §5.8.1)
                </p>
              </div>
            )}
          </div>
        </div>

        <Disclaimer text={data.disclaimer} />
      </div>

      {allValid && result && (
        <PrintNote
          title={data.name}
          reference={data.reference}
          formula={data.formula}
          inputs={[
            { label: "Design Region", value: regionLabel, unit: "—" },
            { label: "Terrain", value: terrainLabel, unit: "—" },
            { label: "Impervious Area", value: imperv, unit: "%" },
            { label: "Project Area", value: area, unit: "ha" },
            { label: "PSD/ha", value: result.psd_lpsHa.toFixed(1), unit: "L/s/ha" },
            { label: "SSR/ha", value: result.ssr_m3Ha.toFixed(1), unit: "m³/ha" },
          ]}
          result={{
            label: "PSD / SSR",
            value: `${result.psd_Ls.toFixed(1)} L/s / ${result.ssr_m3.toFixed(1)} m³`,
            unit: "",
          }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
