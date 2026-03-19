import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

export interface ReportSheet {
  title: string;
  calcId: string;
  saveName: string;
  savedAt: string;
  values: Record<string, string>;
}

export interface ReportPdfDocumentProps {
  projectName?: string;
  projectNo?: string;
  engineerName?: string;
  peNo?: string;
  authority?: string;
  notes?: string;
  sheets: ReportSheet[];
  date: string;
}

const DISCLAIMER =
  "This output is an engineering calculation aid only. All designs submitted to Malaysian authorities must be endorsed by a registered Professional Engineer (PE) under the Board of Engineers Malaysia (BEM) in accordance with the Registration of Engineers Act 1967.";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
  },
  // Shared header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingBottom: 10,
    borderBottom: "2px solid #2563eb",
  },
  brand: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#2563eb",
  },
  brandSuffix: { color: "#6b7280" },
  headerRight: { textAlign: "right", fontSize: 8, color: "#6b7280" },
  // Cover page
  coverTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
    marginBottom: 6,
    marginTop: 24,
  },
  coverSub: { fontSize: 12, color: "#4b5563", marginBottom: 24 },
  infoTable: {
    backgroundColor: "#f8fafc",
    borderRadius: 4,
    padding: 14,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoLabel: {
    width: "35%",
    fontSize: 8,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  infoValue: {
    flex: 1,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
  },
  // TOC
  tocTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
    marginBottom: 10,
  },
  tocRow: {
    flexDirection: "row",
    paddingVertical: 5,
    borderBottom: "1px solid #e5e7eb",
  },
  tocNo: { width: "8%", fontSize: 9, color: "#6b7280" },
  tocName: { flex: 1, fontSize: 9, color: "#374151" },
  tocCalc: { width: "40%", fontSize: 8, color: "#6b7280" },
  // Calc sheet page
  sheetTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  sheetSub: { fontSize: 8, color: "#6b7280", marginBottom: 12 },
  sectionLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 4,
    marginTop: 10,
  },
  table: { marginBottom: 12 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    padding: 5,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  tableHeaderText: {
    color: "#fff",
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  tableRow: {
    flexDirection: "row",
    padding: 5,
    borderBottom: "1px solid #e5e7eb",
  },
  tableRowAlt: {
    flexDirection: "row",
    padding: 5,
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
  },
  colKey: { width: "45%", fontSize: 9, color: "#374151" },
  colVal: { flex: 1, fontSize: 9, color: "#1e293b", textAlign: "right" },
  // Signature block
  signatureRow: { flexDirection: "row", marginTop: 20, gap: 30 },
  signatureBlock: { flex: 1 },
  signatureLine: { borderBottom: "1px solid #9ca3af", marginTop: 36, marginBottom: 3 },
  signatureLabel: { fontSize: 8, color: "#6b7280" },
  // Disclaimer / footer
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  footerText: { fontSize: 7, color: "#d1d5db" },
  disclaimer: {
    marginTop: "auto",
    paddingTop: 10,
    borderTop: "1px solid #e5e7eb",
  },
  disclaimerText: { fontSize: 7, color: "#9ca3af", lineHeight: 1.4 },
  pageNumber: { fontSize: 7, color: "#9ca3af", textAlign: "right" },
  // PE stamp box
  peBox: {
    border: "1px solid #bfdbfe",
    borderRadius: 4,
    padding: 8,
    marginTop: 10,
    backgroundColor: "#eff6ff",
  },
  peBoxLabel: { fontSize: 7, color: "#3b82f6", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 2 },
  peBoxValue: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#1e40af" },
});

// Shared page header component (returns JSX)
function PageHeader({ date, pageLabel }: { date: string; pageLabel: string }) {
  return (
    <View style={styles.header}>
      <Text style={styles.brand}>
        CivilCalc<Text style={styles.brandSuffix}>.my</Text>
      </Text>
      <View style={styles.headerRight}>
        <Text>Calculation Report — {pageLabel}</Text>
        <Text>{date}</Text>
      </View>
    </View>
  );
}

function PageFooter({ date }: { date: string }) {
  return (
    <View style={styles.disclaimer}>
      <Text style={styles.disclaimerText}>Disclaimer: {DISCLAIMER}</Text>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Generated by CivilCalc Malaysia</Text>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
      </View>
    </View>
  );
}

export default function ReportPdfDocument({
  projectName,
  projectNo,
  engineerName,
  peNo,
  authority,
  notes,
  sheets,
  date,
}: ReportPdfDocumentProps) {
  return (
    <Document>
      {/* ── Cover Page ────────────────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <PageHeader date={date} pageLabel="Cover" />

        <Text style={styles.coverTitle}>Structural & Civil Engineering</Text>
        <Text style={styles.coverTitle}>Calculation Report</Text>
        <Text style={styles.coverSub}>Prepared using CivilCalc Malaysia — MS EN Eurocode tools</Text>

        <View style={styles.infoTable}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Project</Text>
            <Text style={styles.infoValue}>{projectName || "—"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Reference No.</Text>
            <Text style={styles.infoValue}>{projectNo || "—"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Prepared By</Text>
            <Text style={styles.infoValue}>{engineerName || "—"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>BEM P.E. No.</Text>
            <Text style={styles.infoValue}>{peNo || "—"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Submitting Authority</Text>
            <Text style={styles.infoValue}>{authority || "—"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Sheets</Text>
            <Text style={styles.infoValue}>{sheets.length}</Text>
          </View>
        </View>

        {notes ? (
          <>
            <Text style={styles.sectionLabel}>Notes / Remarks</Text>
            <View style={{ border: "1px solid #e5e7eb", borderRadius: 4, padding: 8, marginBottom: 12 }}>
              <Text style={{ fontSize: 9, color: "#374151", lineHeight: 1.5 }}>{notes}</Text>
            </View>
          </>
        ) : null}

        {/* PE endorsement block */}
        <View style={styles.peBox}>
          <Text style={styles.peBoxLabel}>Professional Engineer Endorsement Required</Text>
          <Text style={styles.peBoxValue}>
            {engineerName ? `${engineerName}${peNo ? `  |  P.E. No. ${peNo}` : ""}` : "Name / P.E. Number"}
          </Text>
        </View>

        <View style={styles.signatureRow}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Prepared By (Signature & Date)</Text>
          </View>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Checked / Endorsed By P.E. (Signature & Date)</Text>
          </View>
        </View>

        <PageFooter date={date} />
      </Page>

      {/* ── Table of Contents ─────────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <PageHeader date={date} pageLabel="Table of Contents" />
        <Text style={styles.tocTitle}>Table of Contents</Text>

        <View style={[styles.tableHeader, { marginBottom: 0 }]}>
          <Text style={[styles.tableHeaderText, styles.tocNo]}>No.</Text>
          <Text style={[styles.tableHeaderText, styles.tocName]}>Calculation Name</Text>
          <Text style={[styles.tableHeaderText, styles.tocCalc]}>Calculator</Text>
        </View>
        {sheets.map((s, i) => (
          <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
            <Text style={[styles.tocNo, { color: "#6b7280" }]}>{i + 1}</Text>
            <Text style={[styles.tocName, { fontFamily: "Helvetica-Bold" }]}>{s.saveName}</Text>
            <Text style={styles.tocCalc}>{s.title}</Text>
          </View>
        ))}

        <PageFooter date={date} />
      </Page>

      {/* ── Individual Calculation Sheets ─────────────────────── */}
      {sheets.map((sheet, si) => {
        const entries = Object.entries(sheet.values);
        return (
          <Page key={si} size="A4" style={styles.page}>
            <PageHeader date={date} pageLabel={`Sheet ${si + 1} of ${sheets.length}`} />

            <Text style={styles.sheetTitle}>{sheet.saveName}</Text>
            <Text style={styles.sheetSub}>
              Calculator: {sheet.title}  |  Project: {projectName || "—"}  |  Ref: {projectNo || "—"}
            </Text>
            <Text style={styles.sheetSub}>
              Prepared by: {engineerName || "—"}{peNo ? `  (P.E. ${peNo})` : ""}  |  Date: {date}
            </Text>

            <Text style={styles.sectionLabel}>Input Parameters</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.colKey]}>Parameter</Text>
                <Text style={[styles.tableHeaderText, styles.colVal]}>Value</Text>
              </View>
              {entries.map(([k, v], i) => (
                <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                  <Text style={styles.colKey}>{k}</Text>
                  <Text style={[styles.colVal, { fontFamily: "Helvetica-Bold" }]}>{v}</Text>
                </View>
              ))}
            </View>

            <View style={styles.signatureRow}>
              <View style={styles.signatureBlock}>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureLabel}>Prepared By</Text>
              </View>
              <View style={styles.signatureBlock}>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureLabel}>Checked / Endorsed By P.E.</Text>
              </View>
            </View>

            <PageFooter date={date} />
          </Page>
        );
      })}
    </Document>
  );
}
