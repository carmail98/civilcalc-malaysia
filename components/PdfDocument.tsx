import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: "2px solid #2563eb",
  },
  brand: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#2563eb",
  },
  brandSuffix: {
    color: "#6b7280",
  },
  headerRight: {
    textAlign: "right",
    fontSize: 8,
    color: "#6b7280",
  },
  // Title section
  title: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  reference: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 12,
  },
  // Project info
  projectInfo: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 16,
    padding: 10,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
  },
  projectField: {
    flex: 1,
  },
  projectLabel: {
    fontSize: 7,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  projectValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
    minHeight: 14,
  },
  // Formula
  formulaBox: {
    backgroundColor: "#f1f5f9",
    border: "1px solid #e2e8f0",
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  },
  formulaText: {
    fontFamily: "Courier",
    fontSize: 11,
    color: "#334155",
  },
  // Table
  table: {
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    padding: 6,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderText: {
    color: "#ffffff",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    padding: 6,
    borderBottom: "1px solid #e5e7eb",
  },
  tableRowAlt: {
    flexDirection: "row",
    padding: 6,
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
  },
  colParam: { width: "50%" },
  colValue: { width: "30%", textAlign: "right" },
  colUnit: { width: "20%", textAlign: "left", paddingLeft: 8 },
  // Result row
  resultSection: {
    marginBottom: 16,
  },
  resultRow: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#eff6ff",
    border: "2px solid #2563eb",
    borderRadius: 4,
  },
  resultLabel: {
    width: "50%",
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: "#1e40af",
  },
  resultValue: {
    width: "30%",
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    color: "#1e40af",
  },
  resultUnit: {
    width: "20%",
    textAlign: "left",
    paddingLeft: 8,
    fontSize: 10,
    color: "#3b82f6",
    alignSelf: "center",
  },
  // Additional results
  additionalResult: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#f0f9ff",
    border: "1px solid #bfdbfe",
    borderRadius: 4,
    marginTop: 6,
  },
  additionalResultLabel: {
    width: "50%",
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: "#1e40af",
  },
  additionalResultValue: {
    width: "30%",
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: "#1e40af",
  },
  additionalResultUnit: {
    width: "20%",
    textAlign: "left",
    paddingLeft: 8,
    fontSize: 9,
    color: "#3b82f6",
    alignSelf: "center",
  },
  // Notes
  notesBox: {
    border: "1px solid #e5e7eb",
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
    minHeight: 50,
  },
  notesLabel: {
    fontSize: 7,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 9,
    color: "#374151",
    lineHeight: 1.4,
  },
  // Disclaimer
  disclaimer: {
    marginTop: "auto",
    paddingTop: 12,
    borderTop: "1px solid #e5e7eb",
  },
  disclaimerText: {
    fontSize: 7,
    color: "#9ca3af",
    lineHeight: 1.4,
  },
  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  footerText: {
    fontSize: 7,
    color: "#d1d5db",
  },
  // Signature block
  signatureRow: {
    flexDirection: "row",
    marginTop: 20,
    gap: 30,
  },
  signatureBlock: {
    flex: 1,
  },
  signatureLine: {
    borderBottom: "1px solid #9ca3af",
    marginTop: 40,
    marginBottom: 4,
  },
  signatureLabel: {
    fontSize: 8,
    color: "#6b7280",
  },
});

export interface PdfDocumentProps {
  title: string;
  reference: string;
  formula: string;
  inputs: { label: string; value: string; unit: string }[];
  result: { label: string; value: string; unit: string };
  additionalResults?: { label: string; value: string; unit: string }[];
  disclaimer: string;
  projectName?: string;
  engineerName?: string;
  notes?: string;
}

export default function PdfDocument({
  title,
  reference,
  formula,
  inputs,
  result,
  additionalResults,
  disclaimer,
  projectName,
  engineerName,
  notes,
}: PdfDocumentProps) {
  const date = new Date().toLocaleDateString("en-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>
            CivilCalc<Text style={styles.brandSuffix}>.my</Text>
          </Text>
          <View style={styles.headerRight}>
            <Text>Calculation Sheet</Text>
            <Text>{date}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.reference}>Reference: {reference}</Text>

        {/* Project Info */}
        <View style={styles.projectInfo}>
          <View style={styles.projectField}>
            <Text style={styles.projectLabel}>Project</Text>
            <Text style={styles.projectValue}>
              {projectName || "—"}
            </Text>
          </View>
          <View style={styles.projectField}>
            <Text style={styles.projectLabel}>Prepared By</Text>
            <Text style={styles.projectValue}>
              {engineerName || "—"}
            </Text>
          </View>
          <View style={styles.projectField}>
            <Text style={styles.projectLabel}>Date</Text>
            <Text style={styles.projectValue}>{date}</Text>
          </View>
        </View>

        {/* Formula */}
        <View style={styles.formulaBox}>
          <Text style={styles.formulaText}>{formula}</Text>
        </View>

        {/* Input Parameters Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colParam]}>
              Parameter
            </Text>
            <Text style={[styles.tableHeaderText, styles.colValue]}>
              Value
            </Text>
            <Text style={[styles.tableHeaderText, styles.colUnit]}>
              Unit
            </Text>
          </View>
          {inputs.map((inp, i) => (
            <View
              key={i}
              style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
            >
              <Text style={styles.colParam}>{inp.label}</Text>
              <Text style={styles.colValue}>{inp.value}</Text>
              <Text style={styles.colUnit}>{inp.unit}</Text>
            </View>
          ))}
        </View>

        {/* Result */}
        <View style={styles.resultSection}>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>{result.label}</Text>
            <Text style={styles.resultValue}>{result.value}</Text>
            <Text style={styles.resultUnit}>{result.unit}</Text>
          </View>
          {additionalResults?.map((r, i) => (
            <View key={i} style={styles.additionalResult}>
              <Text style={styles.additionalResultLabel}>{r.label}</Text>
              <Text style={styles.additionalResultValue}>{r.value}</Text>
              <Text style={styles.additionalResultUnit}>{r.unit}</Text>
            </View>
          ))}
        </View>

        {/* Notes */}
        <View style={styles.notesBox}>
          <Text style={styles.notesLabel}>Notes / Remarks</Text>
          <Text style={styles.notesText}>{notes || ""}</Text>
        </View>

        {/* Signature block */}
        <View style={styles.signatureRow}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Prepared By</Text>
          </View>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Checked By (P.E.)</Text>
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Disclaimer: {disclaimer}
          </Text>
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Generated by CivilCalc Malaysia (civilcalc.my)
            </Text>
            <Text style={styles.footerText}>{date}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
