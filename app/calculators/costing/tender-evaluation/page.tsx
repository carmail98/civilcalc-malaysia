"use client";

import { useState } from "react";
import CalcInput from "@/components/CalcInput";
import FormulaBox from "@/components/FormulaBox";
import Disclaimer from "@/components/Disclaimer";
import PrintNote from "@/components/PrintNote";
import { tenderEvaluation } from "@/lib/calcEngine";
import formulaData from "@/data/formulas.json";
import PdfExportButton from "@/components/PdfExportButton";
import { useCalcStorage } from "@/lib/useCalcStorage";
import SaveLoadBar from "@/components/SaveLoadBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import KeyTerms from "@/components/KeyTerms";
import { keyTerms } from "@/data/key-terms";

const data = (formulaData as Record<string, any>).tender_evaluation;

export default function TenderEvaluationPage() {
  const [priceWeight, setPriceWeight] = useState("30");
  const [technicalWeight, setTechnicalWeight] = useState("70");
  const [price1, setPrice1] = useState("");
  const [price2, setPrice2] = useState("");
  const [price3, setPrice3] = useState("");
  const [tech1, setTech1] = useState("");
  const [tech2, setTech2] = useState("");
  const [tech3, setTech3] = useState("");

  const pwVal = parseFloat(priceWeight);
  const twVal = parseFloat(technicalWeight);
  const p1Val = parseFloat(price1);
  const p2Val = parseFloat(price2);
  const p3Val = parseFloat(price3);
  const t1Val = parseFloat(tech1);
  const t2Val = parseFloat(tech2);
  const t3Val = parseFloat(tech3);

  const { savedList, save, remove, clearAll, exportCalcs, importCalcs, isLoggedIn, syncing } = useCalcStorage("tender-evaluation");

  const allValid =
    !isNaN(pwVal) && !isNaN(twVal) &&
    !isNaN(p1Val) && !isNaN(p2Val) && !isNaN(p3Val) &&
    !isNaN(t1Val) && !isNaN(t2Val) && !isNaN(t3Val) &&
    pwVal >= 0 && twVal >= 0 &&
    p1Val > 0 && p2Val > 0 && p3Val > 0 &&
    t1Val >= 0 && t1Val <= 100 && t2Val >= 0 && t2Val <= 100 && t3Val >= 0 && t3Val <= 100;

  const result = allValid
    ? tenderEvaluation([p1Val, p2Val, p3Val], [t1Val, t2Val, t3Val], pwVal, twVal)
    : null;

  const fmt = (v: number) => v.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      {/* Screen view */}
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: "QS / Costing", href: "/calculators/costing" }, { label: "Tender Evaluation" }]} />
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{data.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Ref: {data.reference}</p>

        <SaveLoadBar
          savedList={savedList}
          onSave={(name) => save(name, { priceWeight, technicalWeight, price1, price2, price3, tech1, tech2, tech3 })}
          onLoad={(v) => { setPriceWeight(v.priceWeight ?? "30"); setTechnicalWeight(v.technicalWeight ?? "70"); setPrice1(v.price1 ?? ""); setPrice2(v.price2 ?? ""); setPrice3(v.price3 ?? ""); setTech1(v.tech1 ?? ""); setTech2(v.tech2 ?? ""); setTech3(v.tech3 ?? ""); }}
          onRemove={remove}
          onExport={exportCalcs}
          onImport={importCalcs}
          onReset={() => { setPriceWeight("30"); setTechnicalWeight("70"); setPrice1(""); setPrice2(""); setPrice3(""); setTech1(""); setTech2(""); setTech3(""); }}
          isLoggedIn={isLoggedIn}
          syncing={syncing}
          onClearAll={clearAll}
        />

        <FormulaBox formula={data.formula} reference={data.reference} />
        <KeyTerms terms={keyTerms["tender-evaluation"].terms} standard={keyTerms["tender-evaluation"].standard} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">Weightage</h3>
            <CalcInput name="priceWeight" label="Price Weight" unit="%" hint="Weightage for price component" value={priceWeight} onChange={setPriceWeight} min={0} max={100} />
            <CalcInput name="technicalWeight" label="Technical Weight" unit="%" hint="Weightage for technical component" value={technicalWeight} onChange={setTechnicalWeight} min={0} max={100} />

            <h3 className="text-sm font-semibold text-stone-600 mb-2 mt-6 uppercase tracking-wide">Tenderer 1</h3>
            <CalcInput name="price1" label="Tender Price" unit="RM" hint="Tender price for Tenderer 1" value={price1} onChange={setPrice1} min={0} />
            <CalcInput name="tech1" label="Technical Score" unit="/100" hint="Technical score out of 100" value={tech1} onChange={setTech1} min={0} max={100} />

            <h3 className="text-sm font-semibold text-stone-600 mb-2 mt-6 uppercase tracking-wide">Tenderer 2</h3>
            <CalcInput name="price2" label="Tender Price" unit="RM" hint="Tender price for Tenderer 2" value={price2} onChange={setPrice2} min={0} />
            <CalcInput name="tech2" label="Technical Score" unit="/100" hint="Technical score out of 100" value={tech2} onChange={setTech2} min={0} max={100} />

            <h3 className="text-sm font-semibold text-stone-600 mb-2 mt-6 uppercase tracking-wide">Tenderer 3</h3>
            <CalcInput name="price3" label="Tender Price" unit="RM" hint="Tender price for Tenderer 3" value={price3} onChange={setPrice3} min={0} />
            <CalcInput name="tech3" label="Technical Score" unit="/100" hint="Technical score out of 100" value={tech3} onChange={setTech3} min={0} max={100} />

            {allValid && result !== null && (
              <PdfExportButton
                data={{
                  title: data.name,
                  reference: data.reference,
                  formula: data.formula,
                  inputs: [
                    { label: "Price Weight", value: priceWeight, unit: "%" },
                    { label: "Technical Weight", value: technicalWeight, unit: "%" },
                    { label: "Tenderer 1 Price", value: price1, unit: "RM" },
                    { label: "Tenderer 1 Technical", value: tech1, unit: "/100" },
                    { label: "Tenderer 2 Price", value: price2, unit: "RM" },
                    { label: "Tenderer 2 Technical", value: tech2, unit: "/100" },
                    { label: "Tenderer 3 Price", value: price3, unit: "RM" },
                    { label: "Tenderer 3 Technical", value: tech3, unit: "/100" },
                  ],
                  result: {
                    label: `Recommended: Tenderer ${result.recommendedIndex + 1}`,
                    value: `Score: ${result.results[result.recommendedIndex].totalScore.toFixed(2)}`,
                    unit: "",
                  },
                  disclaimer: data.disclaimer,
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            {result && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-stone-100">
                        <th className="border border-stone-200 px-3 py-2 text-left text-stone-700">Tenderer</th>
                        <th className="border border-stone-200 px-3 py-2 text-right text-stone-700">Price (RM)</th>
                        <th className="border border-stone-200 px-3 py-2 text-right text-stone-700">Tech Score</th>
                        <th className="border border-stone-200 px-3 py-2 text-right text-stone-700">Price Score</th>
                        <th className="border border-stone-200 px-3 py-2 text-right text-stone-700">W. Tech</th>
                        <th className="border border-stone-200 px-3 py-2 text-right text-stone-700">W. Price</th>
                        <th className="border border-stone-200 px-3 py-2 text-right text-stone-700">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.results.map((r, i) => (
                        <tr
                          key={i}
                          className={i === result.recommendedIndex ? "bg-green-50 font-semibold" : ""}
                        >
                          <td className="border border-stone-200 px-3 py-2">
                            Tenderer {r.tenderer}
                            {i === result.recommendedIndex && (
                              <span className="ml-2 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Recommended</span>
                            )}
                          </td>
                          <td className="border border-stone-200 px-3 py-2 text-right">{fmt(r.price)}</td>
                          <td className="border border-stone-200 px-3 py-2 text-right">{r.technicalScore.toFixed(1)}</td>
                          <td className="border border-stone-200 px-3 py-2 text-right">{r.priceScore.toFixed(2)}</td>
                          <td className="border border-stone-200 px-3 py-2 text-right">{r.weightedTechnical.toFixed(2)}</td>
                          <td className="border border-stone-200 px-3 py-2 text-right">{r.weightedPrice.toFixed(2)}</td>
                          <td className="border border-stone-200 px-3 py-2 text-right font-bold">{r.totalScore.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-center">
                  <p className="text-sm text-stone-600">Recommended Tenderer</p>
                  <p className="text-2xl font-bold text-green-800">Tenderer {result.results[result.recommendedIndex].tenderer}</p>
                  <p className="text-sm text-stone-600">Total Score: {result.results[result.recommendedIndex].totalScore.toFixed(2)} | Price: RM {fmt(result.results[result.recommendedIndex].price)}</p>
                </div>
              </>
            )}
            {!result && (
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-center text-sm text-stone-400">
                Enter all tender details to see evaluation results
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
            { label: "Price Weight", value: priceWeight, unit: "%" },
            { label: "Technical Weight", value: technicalWeight, unit: "%" },
            { label: "Tenderer 1 Price", value: price1, unit: "RM" },
            { label: "Tenderer 1 Technical", value: tech1, unit: "/100" },
            { label: "Tenderer 2 Price", value: price2, unit: "RM" },
            { label: "Tenderer 2 Technical", value: tech2, unit: "/100" },
            { label: "Tenderer 3 Price", value: price3, unit: "RM" },
            { label: "Tenderer 3 Technical", value: tech3, unit: "/100" },
          ]}
          result={{
            label: `Recommended: Tenderer ${result.recommendedIndex + 1}`,
            value: `Score: ${result.results[result.recommendedIndex].totalScore.toFixed(2)}`,
            unit: "",
          }}
          disclaimer={data.disclaimer}
        />
      )}
    </>
  );
}
