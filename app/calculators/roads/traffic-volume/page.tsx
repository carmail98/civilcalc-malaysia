"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { trafficVolumePCU } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import KeyTerms from "@/components/KeyTerms";
import { keyTerms } from "@/data/key-terms";

const data = (formulaData as Record<string, any>).traffic_volume;

export default function TrafficVolumePage() {
  const [cars, setCars] = useState("");
  const [motorcycles, setMotorcycles] = useState("");
  const [buses, setBuses] = useState("");
  const [heavyVehicles, setHeavyVehicles] = useState("");
  const [mediumLorries, setMediumLorries] = useState("");
  const [peakHourFactor, setPeakHourFactor] = useState("0.90");
  const [laneCapacity, setLaneCapacity] = useState("1500");
  const [numLanes, setNumLanes] = useState("");

  const carsVal = parseFloat(cars);
  const motorcyclesVal = parseFloat(motorcycles);
  const busesVal = parseFloat(buses);
  const heavyVehiclesVal = parseFloat(heavyVehicles);
  const mediumLorriesVal = parseFloat(mediumLorries);
  const peakHourFactorVal = parseFloat(peakHourFactor);
  const laneCapacityVal = parseFloat(laneCapacity);
  const numLanesVal = parseFloat(numLanes);

  const { savedList, save, remove, clearAll, exportCalcs, importCalcs, isLoggedIn, syncing } =
    useCalcStorage("traffic-volume");

  const allValid =
    !isNaN(carsVal) &&
    carsVal >= 0 &&
    !isNaN(motorcyclesVal) &&
    motorcyclesVal >= 0 &&
    !isNaN(busesVal) &&
    busesVal >= 0 &&
    !isNaN(heavyVehiclesVal) &&
    heavyVehiclesVal >= 0 &&
    !isNaN(mediumLorriesVal) &&
    mediumLorriesVal >= 0 &&
    !isNaN(peakHourFactorVal) &&
    peakHourFactorVal > 0 &&
    peakHourFactorVal <= 1 &&
    !isNaN(laneCapacityVal) &&
    laneCapacityVal > 0 &&
    !isNaN(numLanesVal) &&
    numLanesVal >= 1;

  const result = allValid
    ? trafficVolumePCU(
        carsVal,
        motorcyclesVal,
        busesVal,
        heavyVehiclesVal,
        mediumLorriesVal,
        peakHourFactorVal,
        laneCapacityVal,
        numLanesVal
      )
    : null;

  const losColor = (los: string) => {
    if (los === "A" || los === "B") return "border-green-200 bg-green-50 text-green-800";
    if (los === "C") return "border-amber-200 bg-amber-50 text-amber-800";
    if (los === "D") return "border-orange-200 bg-orange-50 text-orange-800";
    return "border-red-200 bg-red-50 text-red-800"; // E or F
  };

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <Breadcrumbs
          items={[
            { label: "Roads", href: "/calculators/roads" },
            { label: "Traffic Volume (PCU)" },
          ]}
        />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) =>
            save(name, {
              cars,
              motorcycles,
              buses,
              heavyVehicles,
              mediumLorries,
              peakHourFactor,
              laneCapacity,
              numLanes,
            })
          }
          onLoad={(v) => {
            setCars(v.cars ?? "");
            setMotorcycles(v.motorcycles ?? "");
            setBuses(v.buses ?? "");
            setHeavyVehicles(v.heavyVehicles ?? "");
            setMediumLorries(v.mediumLorries ?? "");
            setPeakHourFactor(v.peakHourFactor ?? "0.90");
            setLaneCapacity(v.laneCapacity ?? "1500");
            setNumLanes(v.numLanes ?? "");
          }}
          onRemove={remove}
          onExport={exportCalcs}
          onImport={importCalcs}
          isLoggedIn={isLoggedIn}
          syncing={syncing}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />

        <KeyTerms
          terms={keyTerms["traffic-volume"].terms}
          standard={keyTerms["traffic-volume"].standard}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">
              Vehicle Counts
            </h3>
            <CalcInput
              name="cars"
              label={data.variables.cars.label}
              unit={data.variables.cars.unit}
              hint={data.variables.cars.hint}
              value={cars}
              onChange={setCars}
              min={0}
            />
            <CalcInput
              name="motorcycles"
              label={data.variables.motorcycles.label}
              unit={data.variables.motorcycles.unit}
              hint={data.variables.motorcycles.hint}
              value={motorcycles}
              onChange={setMotorcycles}
              min={0}
            />
            <CalcInput
              name="buses"
              label={data.variables.buses.label}
              unit={data.variables.buses.unit}
              hint={data.variables.buses.hint}
              value={buses}
              onChange={setBuses}
              min={0}
            />
            <CalcInput
              name="heavyVehicles"
              label={data.variables.heavyVehicles.label}
              unit={data.variables.heavyVehicles.unit}
              hint={data.variables.heavyVehicles.hint}
              value={heavyVehicles}
              onChange={setHeavyVehicles}
              min={0}
            />
            <CalcInput
              name="mediumLorries"
              label={data.variables.mediumLorries.label}
              unit={data.variables.mediumLorries.unit}
              hint={data.variables.mediumLorries.hint}
              value={mediumLorries}
              onChange={setMediumLorries}
              min={0}
            />

            <h3 className="text-sm font-semibold text-stone-600 mb-2 mt-6 uppercase tracking-wide">
              Road Parameters
            </h3>
            <CalcInput
              name="peakHourFactor"
              label={data.variables.peakHourFactor.label}
              unit={data.variables.peakHourFactor.unit}
              hint={data.variables.peakHourFactor.hint}
              value={peakHourFactor}
              onChange={setPeakHourFactor}
              min={0}
              max={1}
            />
            <CalcInput
              name="laneCapacity"
              label={data.variables.laneCapacity.label}
              unit={data.variables.laneCapacity.unit}
              hint={data.variables.laneCapacity.hint}
              value={laneCapacity}
              onChange={setLaneCapacity}
              min={0}
            />
            <CalcInput
              name="numLanes"
              label={data.variables.numLanes.label}
              unit={data.variables.numLanes.unit}
              hint={data.variables.numLanes.hint}
              value={numLanes}
              onChange={setNumLanes}
              min={1}
            />

            {allValid && result !== null && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: data.formula,
                  inputs: [
                    { label: data.variables.cars.label, value: cars, unit: data.variables.cars.unit },
                    { label: data.variables.motorcycles.label, value: motorcycles, unit: data.variables.motorcycles.unit },
                    { label: data.variables.buses.label, value: buses, unit: data.variables.buses.unit },
                    { label: data.variables.heavyVehicles.label, value: heavyVehicles, unit: data.variables.heavyVehicles.unit },
                    { label: data.variables.mediumLorries.label, value: mediumLorries, unit: data.variables.mediumLorries.unit },
                    { label: data.variables.peakHourFactor.label, value: peakHourFactor, unit: data.variables.peakHourFactor.unit || "—" },
                    { label: data.variables.laneCapacity.label, value: laneCapacity, unit: data.variables.laneCapacity.unit },
                    { label: data.variables.numLanes.label, value: numLanes, unit: data.variables.numLanes.unit || "—" },
                    { label: "PCU (Cars)", value: result.pcuCars.toFixed(2), unit: "PCU" },
                    { label: "PCU (Motorcycles)", value: result.pcuMotorcycles.toFixed(2), unit: "PCU" },
                    { label: "PCU (Buses)", value: result.pcuBuses.toFixed(2), unit: "PCU" },
                    { label: "PCU (Heavy)", value: result.pcuHeavy.toFixed(2), unit: "PCU" },
                    { label: "PCU (Medium)", value: result.pcuMedium.toFixed(2), unit: "PCU" },
                    { label: "Total Vehicles", value: result.totalVehicles.toFixed(0), unit: "veh/hr" },
                    { label: "Design Volume", value: result.designVolume.toFixed(2), unit: "PCU/hr" },
                    { label: "Capacity", value: result.capacity.toFixed(0), unit: "PCU/hr" },
                    { label: "V/C Ratio", value: result.vcRatio.toFixed(4), unit: "" },
                  ],
                  result: {
                    label: "Level of Service",
                    value: `${result.LOS} — ${result.losDescription}`,
                    unit: "",
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
                  label="PCU — Cars"
                  value={result.pcuCars}
                  unit="PCU"
                  decimals={2}
                />
                <CalcResult
                  label="PCU — Motorcycles"
                  value={result.pcuMotorcycles}
                  unit="PCU"
                  decimals={2}
                />
                <CalcResult
                  label="PCU — Buses"
                  value={result.pcuBuses}
                  unit="PCU"
                  decimals={2}
                />
                <CalcResult
                  label="PCU — Heavy Vehicles"
                  value={result.pcuHeavy}
                  unit="PCU"
                  decimals={2}
                />
                <CalcResult
                  label="PCU — Medium Lorries"
                  value={result.pcuMedium}
                  unit="PCU"
                  decimals={2}
                />
                <CalcResult
                  label="Total PCU"
                  value={result.totalPCU}
                  unit="PCU/hr"
                  decimals={2}
                />
                <CalcResult
                  label="Total Vehicles"
                  value={result.totalVehicles}
                  unit="veh/hr"
                  decimals={0}
                />
                <CalcResult
                  label="Design Volume"
                  value={result.designVolume}
                  unit="PCU/hr"
                  decimals={2}
                />
                <CalcResult
                  label="Capacity"
                  value={result.capacity}
                  unit="PCU/hr"
                  decimals={0}
                />
                <CalcResult
                  label="V/C Ratio"
                  value={result.vcRatio}
                  unit=""
                />

                {/* LOS colored status box */}
                <div className={`rounded-lg border p-4 ${losColor(result.LOS)}`}>
                  <p className="text-sm font-semibold">Level of Service</p>
                  <p className="text-3xl font-bold mt-1">LOS {result.LOS}</p>
                  <p className="text-sm mt-1">{result.losDescription}</p>
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
            { label: data.variables.cars.label, value: cars, unit: data.variables.cars.unit },
            { label: data.variables.motorcycles.label, value: motorcycles, unit: data.variables.motorcycles.unit },
            { label: data.variables.buses.label, value: buses, unit: data.variables.buses.unit },
            { label: data.variables.heavyVehicles.label, value: heavyVehicles, unit: data.variables.heavyVehicles.unit },
            { label: data.variables.mediumLorries.label, value: mediumLorries, unit: data.variables.mediumLorries.unit },
            { label: data.variables.peakHourFactor.label, value: peakHourFactor, unit: data.variables.peakHourFactor.unit || "—" },
            { label: data.variables.laneCapacity.label, value: laneCapacity, unit: data.variables.laneCapacity.unit },
            { label: data.variables.numLanes.label, value: numLanes, unit: data.variables.numLanes.unit || "—" },
            { label: "PCU (Cars)", value: result.pcuCars.toFixed(2), unit: "PCU" },
            { label: "PCU (Motorcycles)", value: result.pcuMotorcycles.toFixed(2), unit: "PCU" },
            { label: "PCU (Buses)", value: result.pcuBuses.toFixed(2), unit: "PCU" },
            { label: "PCU (Heavy)", value: result.pcuHeavy.toFixed(2), unit: "PCU" },
            { label: "PCU (Medium)", value: result.pcuMedium.toFixed(2), unit: "PCU" },
            { label: "Total PCU", value: result.totalPCU.toFixed(2), unit: "PCU/hr" },
            { label: "Total Vehicles", value: result.totalVehicles.toFixed(0), unit: "veh/hr" },
            { label: "Design Volume", value: result.designVolume.toFixed(2), unit: "PCU/hr" },
            { label: "Capacity", value: result.capacity.toFixed(0), unit: "PCU/hr" },
            { label: "V/C Ratio", value: result.vcRatio.toFixed(4), unit: "" },
          ]}
          result={{
            label: "Level of Service",
            value: `LOS ${result.LOS} — ${result.losDescription}`,
            unit: "",
          }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
