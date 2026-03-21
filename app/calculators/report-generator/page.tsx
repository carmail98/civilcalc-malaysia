"use client";

import { useState, useEffect, useCallback } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import type { SavedCalc } from "@/lib/useCalcStorage";

// Registry of all known calculators
const CALC_REGISTRY: { id: string; name: string; category: string }[] = [
  { id: "load-takeoff", name: "Load Take-Off (Slab to Beam)", category: "Structural" },
  { id: "beam-moment", name: "RC Beam Moment Capacity", category: "Structural" },
  { id: "beam-shear", name: "RC Beam Shear Design", category: "Structural" },
  { id: "column-interaction", name: "RC Column N-M Interaction", category: "Structural" },
  { id: "pad-footing", name: "Isolated Pad Footing Design", category: "Structural" },
  { id: "crack-width", name: "Crack Width Control SLS", category: "Structural" },
  { id: "drainage", name: "Rational Method — Peak Flow", category: "Drainage" },
  { id: "idf", name: "IDF Curve", category: "Drainage" },
  { id: "drain-sizing", name: "Manning's Drain Sizing", category: "Drainage" },
  { id: "detention-pond", name: "Detention Pond Volume", category: "Drainage" },
  { id: "culvert-design", name: "Culvert Hydraulic Design", category: "Drainage" },
  { id: "sewerage", name: "Sewer Pipe Sizing", category: "Sewerage" },
  { id: "earthworks", name: "Earthworks Cut & Fill Volume", category: "Earthworks" },
  { id: "roads/pavement", name: "Flexible Pavement Design", category: "Roads" },
];

interface SavedSheet {
  calcId: string;
  calcName: string;
  category: string;
  savedCalc: SavedCalc;
  selected: boolean;
}

const DISCLAIMER_TEXT =
  "This output is an engineering calculation aid only and does not constitute a final or endorsed design. All designs submitted to Malaysian authorities must be endorsed by a registered Professional Engineer (PE) under the Board of Engineers Malaysia (BEM) in accordance with the Registration of Engineers Act 1967.";

export default function ReportGeneratorPage() {
  const [sheets, setSheets] = useState<SavedSheet[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Project metadata
  const [projectName, setProjectName] = useState("");
  const [projectNo, setProjectNo] = useState("");
  const [engineerName, setEngineerName] = useState("");
  const [peNo, setPeNo] = useState("");
  const [authority, setAuthority] = useState("JKR");
  const [notes, setNotes] = useState("");

  const [generating, setGenerating] = useState(false);

  // Scan localStorage on mount
  useEffect(() => {
    const discovered: SavedSheet[] = [];
    for (const calc of CALC_REGISTRY) {
      try {
        const raw = localStorage.getItem(`civilcalc_${calc.id}`);
        if (raw) {
          const list: SavedCalc[] = JSON.parse(raw);
          for (const sc of list) {
            discovered.push({
              calcId: calc.id,
              calcName: calc.name,
              category: calc.category,
              savedCalc: sc,
              selected: true,
            });
          }
        }
      } catch {
        // ignore corrupt data
      }
    }
    setSheets(discovered);
    setLoaded(true);
  }, []);

  const toggleSelect = useCallback((idx: number) => {
    setSheets((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, selected: !s.selected } : s))
    );
  }, []);

  const moveUp = useCallback((idx: number) => {
    if (idx === 0) return;
    setSheets((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  }, []);

  const moveDown = useCallback((idx: number) => {
    setSheets((prev) => {
      if (idx === prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  }, []);

  const selectedSheets = sheets.filter((s) => s.selected);

  const handleGenerate = useCallback(async () => {
    if (selectedSheets.length === 0) return;
    setGenerating(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { default: ReportPdfDocument } = await import(
        "@/components/ReportPdfDocument"
      );

      const blob = await pdf(
        <ReportPdfDocument
          projectName={projectName}
          projectNo={projectNo}
          engineerName={engineerName}
          peNo={peNo}
          authority={authority}
          notes={notes}
          sheets={selectedSheets.map((s) => ({
            title: s.calcName,
            calcId: s.calcId,
            saveName: s.savedCalc.name,
            savedAt: s.savedCalc.savedAt,
            values: s.savedCalc.values,
          }))}
          date={new Date().toLocaleDateString("en-MY", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const slug = (projectName || "report").toLowerCase().replace(/[^a-z0-9]+/g, "-");
      a.download = `civilcalc-report-${slug}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Report generation failed:", err);
      alert("Report generation failed. Please try again.");
    } finally {
      setGenerating(false);
    }
  }, [selectedSheets, projectName, projectNo, engineerName, peNo, authority, notes]);

  // Group sheets by category for display
  const categories = Array.from(new Set(sheets.map((s) => s.category)));

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Calculators", href: "/calculators" },
          { label: "Report Generator" },
        ]}
      />
      <h1 className="text-2xl font-bold text-stone-800 mb-1">
        Calculation Report Generator
      </h1>
      <p className="text-sm text-stone-500 mb-6">
        Ref: PBT / JKR submission — aggregates saved calculation sheets into a single PDF
      </p>

      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 mb-6">
        <p className="text-sm text-amber-800">
          <strong>How to use:</strong> Save individual calculations from each calculator page first (using the Save button), then return here to select and compile them into a submission-ready PDF report.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left column: project info + sheet selection */}
        <div>
          <h2 className="text-sm font-semibold text-stone-700 mb-3 uppercase tracking-wide">
            Project Details
          </h2>
          <div className="space-y-3 mb-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Taman Seri Indah Phase 2"
                className="w-full rounded-2xl border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Project / Reference No.</label>
              <input
                type="text"
                value={projectNo}
                onChange={(e) => setProjectNo(e.target.value)}
                placeholder="e.g. JKR/KL/2024/001"
                className="w-full rounded-2xl border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Prepared By (P.E.)</label>
                <input
                  type="text"
                  value={engineerName}
                  onChange={(e) => setEngineerName(e.target.value)}
                  placeholder="Ir. Ahmad bin Ismail"
                  className="w-full rounded-2xl border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">BEM P.E. No.</label>
                <input
                  type="text"
                  value={peNo}
                  onChange={(e) => setPeNo(e.target.value)}
                  placeholder="e.g. 12345"
                  className="w-full rounded-2xl border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Submitting Authority</label>
              <select
                value={authority}
                onChange={(e) => setAuthority(e.target.value)}
                className="w-full rounded-2xl border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="JKR">JKR (Jabatan Kerja Raya)</option>
                <option value="PBT">PBT (Pihak Berkuasa Tempatan)</option>
                <option value="DBKL">DBKL</option>
                <option value="MBPJ">MBPJ</option>
                <option value="MPSJ">MPSJ</option>
                <option value="MBSP">MBSP</option>
                <option value="MPKK">MPKK</option>
                <option value="IWK">IWK / SPAN</option>
                <option value="TNB">TNB</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Notes / Remarks</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="e.g. Design basis, revision notes, assumptions..."
                className="w-full rounded-2xl border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
              />
            </div>
          </div>

          {/* Calculation sheets */}
          <h2 className="text-sm font-semibold text-stone-700 mb-3 uppercase tracking-wide">
            Saved Calculations
          </h2>

          {!loaded ? (
            <p className="text-sm text-stone-400">Loading...</p>
          ) : sheets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 p-6 text-center">
              <p className="text-sm text-stone-500">No saved calculations found.</p>
              <p className="text-xs text-stone-400 mt-1">
                Use the Save button on any calculator page to save a calculation, then return here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((cat) => {
                const catSheets = sheets
                  .map((s, i) => ({ ...s, _idx: i }))
                  .filter((s) => s.category === cat);
                if (catSheets.length === 0) return null;
                return (
                  <div key={cat}>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2">
                      {cat}
                    </h3>
                    <div className="space-y-1">
                      {catSheets.map(({ _idx, calcName, savedCalc, selected }) => (
                        <div
                          key={_idx}
                          className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm ${
                            selected
                              ? "border-amber-200 bg-amber-50"
                              : "border-stone-200 bg-white"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleSelect(_idx)}
                            className="h-4 w-4 rounded border-stone-300 text-amber-600"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-stone-700 truncate">{savedCalc.name}</p>
                            <p className="text-xs text-stone-400 truncate">{calcName}</p>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <button
                              onClick={() => moveUp(_idx)}
                              className="text-stone-400 hover:text-stone-600 text-xs leading-none"
                              title="Move up"
                            >▲</button>
                            <button
                              onClick={() => moveDown(_idx)}
                              className="text-stone-400 hover:text-stone-600 text-xs leading-none"
                              title="Move down"
                            >▼</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column: preview + generate */}
        <div>
          <h2 className="text-sm font-semibold text-stone-700 mb-3 uppercase tracking-wide">
            Report Preview
          </h2>

          <div className="rounded-2xl border border-stone-200 bg-white p-4 mb-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-base font-bold text-amber-700">
                  CivilCalc<span className="text-stone-400">.my</span>
                </p>
                <p className="text-xs text-stone-500">Calculation Report</p>
              </div>
              <p className="text-xs text-stone-400">
                {new Date().toLocaleDateString("en-MY", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="border-t border-stone-100 pt-3 space-y-1">
              <p className="text-sm font-medium text-stone-700">{projectName || <span className="text-stone-300">Project Name</span>}</p>
              <p className="text-xs text-stone-500">Ref: {projectNo || "—"}</p>
              <p className="text-xs text-stone-500">Engineer: {engineerName || "—"} {peNo ? `(P.E. ${peNo})` : ""}</p>
              <p className="text-xs text-stone-500">Authority: {authority}</p>
            </div>
            <div className="border-t border-stone-100 mt-3 pt-3">
              <p className="text-xs font-semibold text-stone-600 mb-2">
                Calculation Sheets ({selectedSheets.length})
              </p>
              {selectedSheets.length === 0 ? (
                <p className="text-xs text-stone-400">No sheets selected</p>
              ) : (
                <ol className="space-y-1">
                  {selectedSheets.map((s, i) => (
                    <li key={i} className="text-xs text-stone-600 flex gap-2">
                      <span className="text-stone-400 w-4 shrink-0">{i + 1}.</span>
                      <span>
                        <span className="font-medium">{s.savedCalc.name}</span>
                        <span className="text-stone-400"> — {s.calcName}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 mb-4">
            <p className="text-xs text-amber-800">
              <strong>PE Endorsement Required:</strong> This report is a calculation aid only. All designs submitted to PBT/JKR must be endorsed by a BEM-registered Professional Engineer under the Registration of Engineers Act 1967.
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating || selectedSheets.length === 0}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {generating ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                </svg>
                Generating Report...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Report PDF ({selectedSheets.length} sheet{selectedSheets.length !== 1 ? "s" : ""})
              </>
            )}
          </button>

          {selectedSheets.length === 0 && loaded && sheets.length > 0 && (
            <p className="text-xs text-center text-stone-400 mt-2">
              Select at least one calculation sheet above.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-stone-50 border border-stone-200 p-3">
        <p className="text-xs text-stone-500">{DISCLAIMER_TEXT}</p>
      </div>
    </div>
  );
}
