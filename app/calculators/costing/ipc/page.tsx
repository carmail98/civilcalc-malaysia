"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import CalcResult from "@/components/CalcResult";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { interimPaymentCert } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import KeyTerms from "@/components/KeyTerms";
import { keyTerms } from "@/data/key-terms";

const data = (formulaData as Record<string, any>).interim_payment;

export default function InterimPaymentCertPage() {
  const [workDone, setWorkDone] = useState("");
  const [variations, setVariations] = useState("");
  const [materialsOnSite, setMaterialsOnSite] = useState("");
  const [advancePayment, setAdvancePayment] = useState("0");
  const [retentionPercent, setRetentionPercent] = useState("5");
  const [retentionLimit, setRetentionLimit] = useState("5");
  const [contractSum, setContractSum] = useState("");
  const [previousCertified, setPreviousCertified] = useState("0");
  const [previousRetention, setPreviousRetention] = useState("0");

  const wdVal = parseFloat(workDone);
  const varVal = parseFloat(variations);
  const mosVal = parseFloat(materialsOnSite);
  const apVal = parseFloat(advancePayment);
  const rpVal = parseFloat(retentionPercent);
  const rlVal = parseFloat(retentionLimit);
  const csVal = parseFloat(contractSum);
  const pcVal = parseFloat(previousCertified);
  const prVal = parseFloat(previousRetention);

  const { savedList, save, remove, clearAll, exportCalcs, importCalcs, isLoggedIn, syncing } = useCalcStorage("interim-payment");

  const allValid =
    !isNaN(wdVal) && !isNaN(varVal) && !isNaN(mosVal) &&
    !isNaN(apVal) && !isNaN(rpVal) && !isNaN(rlVal) &&
    !isNaN(csVal) && !isNaN(pcVal) && !isNaN(prVal) &&
    wdVal >= 0 && varVal >= 0 && mosVal >= 0 &&
    apVal >= 0 && rpVal >= 0 && rlVal >= 0 &&
    csVal > 0 && pcVal >= 0 && prVal >= 0;

  const result = allValid
    ? interimPaymentCert(wdVal, varVal, mosVal, apVal, rpVal, rlVal, csVal, pcVal, prVal)
    : null;

  const fmt = (v: number) => v.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: "QS / Costing", href: "/calculators/costing" }, { label: "Interim Payment Certificate" }]} />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { workDone, variations, materialsOnSite, advancePayment, retentionPercent, retentionLimit, contractSum, previousCertified, previousRetention })}
          onLoad={(v) => { setWorkDone(v.workDone ?? ""); setVariations(v.variations ?? ""); setMaterialsOnSite(v.materialsOnSite ?? ""); setAdvancePayment(v.advancePayment ?? "0"); setRetentionPercent(v.retentionPercent ?? "5"); setRetentionLimit(v.retentionLimit ?? "5"); setContractSum(v.contractSum ?? ""); setPreviousCertified(v.previousCertified ?? "0"); setPreviousRetention(v.previousRetention ?? "0"); }}
          onRemove={remove}
          onExport={exportCalcs}
          onImport={importCalcs}
          onReset={() => { setWorkDone(""); setVariations(""); setMaterialsOnSite(""); setAdvancePayment("0"); setRetentionPercent("5"); setRetentionLimit("5"); setContractSum(""); setPreviousCertified("0"); setPreviousRetention("0"); }}
          isLoggedIn={isLoggedIn}
          syncing={syncing}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />
        <KeyTerms terms={keyTerms["interim-payment"].terms} standard={keyTerms["interim-payment"].standard} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <CalcInput name="workDone" label="Work Done" unit="RM" hint="Value of work completed to date" value={workDone} onChange={setWorkDone} min={0} />
            <CalcInput name="variations" label="Variations" unit="RM" hint="Value of approved variations" value={variations} onChange={setVariations} min={0} />
            <CalcInput name="materialsOnSite" label="Materials on Site" unit="RM" hint="Value of materials stored on site" value={materialsOnSite} onChange={setMaterialsOnSite} min={0} />
            <CalcInput name="advancePayment" label="Advance Payment" unit="RM" hint="Total advance payment issued" value={advancePayment} onChange={setAdvancePayment} min={0} />
            <CalcInput name="retentionPercent" label="Retention" unit="%" hint="Retention percentage (typically 5%)" value={retentionPercent} onChange={setRetentionPercent} min={0} max={100} />
            <CalcInput name="retentionLimit" label="Retention Limit" unit="%" hint="Maximum retention as % of contract sum (typically 5%)" value={retentionLimit} onChange={setRetentionLimit} min={0} max={100} />
            <CalcInput name="contractSum" label="Contract Sum" unit="RM" hint="Total contract sum" value={contractSum} onChange={setContractSum} min={0} />
            <CalcInput name="previousCertified" label="Previously Certified" unit="RM" hint="Total amount previously certified" value={previousCertified} onChange={setPreviousCertified} min={0} />
            <CalcInput name="previousRetention" label="Previous Retention" unit="RM" hint="Cumulative retention from previous certificates" value={previousRetention} onChange={setPreviousRetention} min={0} />

            {allValid && result !== null && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: data.formula,
                  inputs: [
                    { label: "Work Done", value: workDone, unit: "RM" },
                    { label: "Variations", value: variations, unit: "RM" },
                    { label: "Materials on Site", value: materialsOnSite, unit: "RM" },
                    { label: "Advance Payment", value: advancePayment, unit: "RM" },
                    { label: "Retention", value: retentionPercent, unit: "%" },
                    { label: "Retention Limit", value: retentionLimit, unit: "%" },
                    { label: "Contract Sum", value: contractSum, unit: "RM" },
                    { label: "Previously Certified", value: previousCertified, unit: "RM" },
                    { label: "Previous Retention", value: previousRetention, unit: "RM" },
                  ],
                  result: {
                    label: "Amount Due This Certificate",
                    value: `RM ${fmt(result.amountDue)}`,
                    unit: "",
                  },
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            <CalcResult label="Gross Valuation" value={result ? result.grossValuation : null} unit="RM" />
            <CalcResult label="Retention (this cert)" value={result ? result.retention : null} unit="RM" />
            <CalcResult label="Cumulative Retention" value={result ? result.cumulativeRetention : null} unit="RM" />

            {result && result.retentionCapped && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                Retention has reached the maximum limit ({rlVal}% of contract sum = RM {fmt(csVal * rlVal / 100)}). No further retention will be deducted.
              </div>
            )}

            <CalcResult label="Advance Recovery" value={result ? result.advanceRecovery : null} unit="RM" />
            <CalcResult label="Net Valuation" value={result ? result.netValuation : null} unit="RM" />
            <CalcResult label="Percent Complete" value={result ? result.percentComplete : null} unit="%" />

            {result && (
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-center">
                <p className="text-sm text-stone-600">Amount Due This Certificate</p>
                <p className="text-2xl font-bold text-stone-800">RM {fmt(result.amountDue)}</p>
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
            { label: "Work Done", value: workDone, unit: "RM" },
            { label: "Variations", value: variations, unit: "RM" },
            { label: "Materials on Site", value: materialsOnSite, unit: "RM" },
            { label: "Advance Payment", value: advancePayment, unit: "RM" },
            { label: "Retention", value: retentionPercent, unit: "%" },
            { label: "Retention Limit", value: retentionLimit, unit: "%" },
            { label: "Contract Sum", value: contractSum, unit: "RM" },
            { label: "Previously Certified", value: previousCertified, unit: "RM" },
            { label: "Previous Retention", value: previousRetention, unit: "RM" },
            { label: "Gross Valuation", value: fmt(result.grossValuation), unit: "RM" },
            { label: "Cumulative Retention", value: fmt(result.cumulativeRetention), unit: "RM" },
            { label: "Retention Capped", value: result.retentionCapped ? "Yes" : "No", unit: "" },
          ]}
          result={{
            label: "Amount Due This Certificate",
            value: `RM ${fmt(result.amountDue)}`,
            unit: "",
          }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
