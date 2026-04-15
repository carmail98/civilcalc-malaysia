"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { finalAccountSummary } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import KeyTerms from "@/components/KeyTerms";
import { keyTerms } from "@/data/key-terms";

const data = (formulaData as Record<string, any>).final_account;

export default function FinalAccountPage() {
  const [originalContract, setOriginalContract] = useState("");
  const [totalVO, setTotalVO] = useState("");
  const [provisionalSumAllowed, setProvisionalSumAllowed] = useState("");
  const [provisionalSumExpended, setProvisionalSumExpended] = useState("");
  const [primeCostAllowed, setPrimeCostAllowed] = useState("");
  const [primeCostExpended, setPrimeCostExpended] = useState("");
  const [claimsApproved, setClaimsApproved] = useState("0");
  const [ladDays, setLadDays] = useState("0");
  const [ladRate, setLadRate] = useState("0");

  const ocVal = parseFloat(originalContract);
  const voVal = parseFloat(totalVO);
  const psaVal = parseFloat(provisionalSumAllowed);
  const pseVal = parseFloat(provisionalSumExpended);
  const pcaVal = parseFloat(primeCostAllowed);
  const pceVal = parseFloat(primeCostExpended);
  const clVal = parseFloat(claimsApproved);
  const ldVal = parseFloat(ladDays);
  const lrVal = parseFloat(ladRate);

  const { savedList, save, remove, clearAll, exportCalcs, importCalcs, isLoggedIn, syncing } = useCalcStorage("final-account");

  const allValid =
    !isNaN(ocVal) && !isNaN(voVal) &&
    !isNaN(psaVal) && !isNaN(pseVal) &&
    !isNaN(pcaVal) && !isNaN(pceVal) &&
    !isNaN(clVal) && !isNaN(ldVal) && !isNaN(lrVal) &&
    ocVal > 0 && psaVal >= 0 && pseVal >= 0 &&
    pcaVal >= 0 && pceVal >= 0 && clVal >= 0 &&
    ldVal >= 0 && lrVal >= 0;

  const result = allValid
    ? finalAccountSummary(ocVal, voVal, pseVal, psaVal, pceVal, pcaVal, clVal, ldVal, lrVal)
    : null;

  const fmt = (v: number) => v.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: "QS / Costing", href: "/calculators/costing" }, { label: "Final Account" }]} />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { originalContract, totalVO, provisionalSumAllowed, provisionalSumExpended, primeCostAllowed, primeCostExpended, claimsApproved, ladDays, ladRate })}
          onLoad={(v) => { setOriginalContract(v.originalContract ?? ""); setTotalVO(v.totalVO ?? ""); setProvisionalSumAllowed(v.provisionalSumAllowed ?? ""); setProvisionalSumExpended(v.provisionalSumExpended ?? ""); setPrimeCostAllowed(v.primeCostAllowed ?? ""); setPrimeCostExpended(v.primeCostExpended ?? ""); setClaimsApproved(v.claimsApproved ?? "0"); setLadDays(v.ladDays ?? "0"); setLadRate(v.ladRate ?? "0"); }}
          onRemove={remove}
          onExport={exportCalcs}
          onImport={importCalcs}
          isLoggedIn={isLoggedIn}
          syncing={syncing}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />
        <KeyTerms terms={keyTerms["final-account"].terms} standard={keyTerms["final-account"].standard} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <CalcInput name="originalContract" label="Original Contract Sum" unit="RM" hint="Original contract value" value={originalContract} onChange={setOriginalContract} min={0} />
            <CalcInput name="totalVO" label="Total Variation Orders" unit="RM" hint="Net total of all variation orders" value={totalVO} onChange={setTotalVO} />
            <CalcInput name="provisionalSumAllowed" label="Provisional Sum Allowed" unit="RM" hint="Provisional sum in contract" value={provisionalSumAllowed} onChange={setProvisionalSumAllowed} min={0} />
            <CalcInput name="provisionalSumExpended" label="Provisional Sum Expended" unit="RM" hint="Actual provisional sum spent" value={provisionalSumExpended} onChange={setProvisionalSumExpended} min={0} />
            <CalcInput name="primeCostAllowed" label="Prime Cost Allowed" unit="RM" hint="Prime cost sum in contract" value={primeCostAllowed} onChange={setPrimeCostAllowed} min={0} />
            <CalcInput name="primeCostExpended" label="Prime Cost Expended" unit="RM" hint="Actual prime cost spent" value={primeCostExpended} onChange={setPrimeCostExpended} min={0} />
            <CalcInput name="claimsApproved" label="Claims Approved" unit="RM" hint="Total approved claims (default 0)" value={claimsApproved} onChange={setClaimsApproved} min={0} />
            <CalcInput name="ladDays" label="LAD Days" unit="days" hint="Number of days for LAD (default 0)" value={ladDays} onChange={setLadDays} min={0} />
            <CalcInput name="ladRate" label="LAD Rate" unit="RM/day" hint="LAD rate per day (default 0)" value={ladRate} onChange={setLadRate} min={0} />

            {allValid && result !== null && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: data.formula,
                  inputs: [
                    { label: "Original Contract Sum", value: originalContract, unit: "RM" },
                    { label: "Total VO", value: totalVO, unit: "RM" },
                    { label: "PS Allowed", value: provisionalSumAllowed, unit: "RM" },
                    { label: "PS Expended", value: provisionalSumExpended, unit: "RM" },
                    { label: "PC Allowed", value: primeCostAllowed, unit: "RM" },
                    { label: "PC Expended", value: primeCostExpended, unit: "RM" },
                    { label: "Claims Approved", value: claimsApproved, unit: "RM" },
                    { label: "LAD Days", value: ladDays, unit: "days" },
                    { label: "LAD Rate", value: ladRate, unit: "RM/day" },
                  ],
                  result: {
                    label: "Final Account Value",
                    value: `RM ${fmt(result.finalAccountValue)}`,
                    unit: "",
                  },
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            <CalcResult label="Adjusted Contract Sum" value={result ? result.adjustedContractSum : null} unit="RM" />
            <CalcResult label="PS Adjustment" value={result ? result.psAdjustment : null} unit="RM" />
            <CalcResult label="PC Adjustment" value={result ? result.pcAdjustment : null} unit="RM" />
            <CalcResult label="Total LAD" value={result ? result.totalLAD : null} unit="RM" />
            <CalcResult label="Final Account Value" value={result ? result.finalAccountValue : null} unit="RM" />
            <CalcResult label="Net Difference" value={result ? result.netDifference : null} unit="RM" />
            <CalcResult label="Percent Variation" value={result ? result.percentVariation : null} unit="%" />

            {result && (
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 space-y-2">
                <div className="flex justify-between text-sm text-stone-700">
                  <span>Original Contract</span>
                  <span className="font-semibold">RM {fmt(ocVal)}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-700">
                  <span>Final Account Value</span>
                  <span className="font-semibold">RM {fmt(result.finalAccountValue)}</span>
                </div>
                <hr className="border-stone-300" />
                <div className={`flex justify-between text-base font-bold ${result.netDifference >= 0 ? "text-red-700" : "text-green-700"}`}>
                  <span>Net Difference</span>
                  <span>RM {fmt(result.netDifference)} ({result.percentVariation.toFixed(1)}%)</span>
                </div>
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
            { label: "Original Contract Sum", value: originalContract, unit: "RM" },
            { label: "Total VO", value: totalVO, unit: "RM" },
            { label: "PS Allowed", value: provisionalSumAllowed, unit: "RM" },
            { label: "PS Expended", value: provisionalSumExpended, unit: "RM" },
            { label: "PC Allowed", value: primeCostAllowed, unit: "RM" },
            { label: "PC Expended", value: primeCostExpended, unit: "RM" },
            { label: "Claims Approved", value: claimsApproved, unit: "RM" },
            { label: "LAD Days", value: ladDays, unit: "days" },
            { label: "LAD Rate", value: ladRate, unit: "RM/day" },
            { label: "Adjusted Contract Sum", value: fmt(result.adjustedContractSum), unit: "RM" },
            { label: "PS Adjustment", value: fmt(result.psAdjustment), unit: "RM" },
            { label: "PC Adjustment", value: fmt(result.pcAdjustment), unit: "RM" },
            { label: "Total LAD", value: fmt(result.totalLAD), unit: "RM" },
          ]}
          result={{
            label: "Final Account Value",
            value: `RM ${fmt(result.finalAccountValue)}`,
            unit: "",
          }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
