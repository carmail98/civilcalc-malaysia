"use client";

import { useState, useCallback } from "react";
import type { PdfDocumentProps } from "./PdfDocument";

interface PdfExportButtonProps {
  /** All the data needed for the PDF, except projectName/engineerName/notes */
  data: Omit<PdfDocumentProps, "projectName" | "engineerName" | "notes">;
}

export default function PdfExportButton({ data }: PdfExportButtonProps) {
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [engineerName, setEngineerName] = useState("");
  const [notes, setNotes] = useState("");

  const handleExport = useCallback(async () => {
    setGenerating(true);
    try {
      // Dynamic imports to keep bundle small
      const { pdf } = await import("@react-pdf/renderer");
      const { default: PdfDocument } = await import("./PdfDocument");

      const blob = await pdf(
        <PdfDocument
          {...data}
          projectName={projectName}
          engineerName={engineerName}
          notes={notes}
        />
      ).toBlob();

      // Download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      a.download = `civilcalc-${slug}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setOpen(false);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF generation failed. Please try again.");
    } finally {
      setGenerating(false);
    }
  }, [data, projectName, engineerName, notes]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 transition-colors"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Export PDF
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-stone-800 mb-1">
              Export Calculation Sheet
            </h2>
            <p className="text-sm text-stone-500 mb-4">
              Optional details for your PDF document.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Taman Seri Indah Phase 2"
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Prepared By
                </label>
                <input
                  type="text"
                  value={engineerName}
                  onChange={(e) => setEngineerName(e.target.value)}
                  placeholder="e.g. Ir. Ahmad bin Ismail"
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Notes / Remarks
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="e.g. Design for 10-year ARI storm event"
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-3 justify-end">
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
                disabled={generating}
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={generating}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50 transition-colors"
              >
                {generating ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="opacity-25"
                      />
                      <path
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        className="opacity-75"
                      />
                    </svg>
                    Generating...
                  </>
                ) : (
                  "Download PDF"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
