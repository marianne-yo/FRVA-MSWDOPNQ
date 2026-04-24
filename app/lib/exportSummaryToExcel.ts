import * as XLSX from "xlsx"

type RecencyData = { type: string; total: number }
type CategoryData = { name: string; value: number }
type TopRisk = { text: string; count: number }

export function exportSummaryToExcel(params: {
  totalRespondents: number
  completionRate: string
  highRiskHouseholds: number | undefined
  fourPsPercentage: string
  recencyData: RecencyData[]
  categoryData: CategoryData[]
  topFiveRisks: TopRisk[]
  filename?: string
}) {
  const {
    totalRespondents,
    completionRate,
    highRiskHouseholds,
    fourPsPercentage,
    recencyData,
    categoryData,
    topFiveRisks,
    filename = "Summary_Report",
  } = params

  const workbook = XLSX.utils.book_new()

  // ── Sheet 1: Overview ──────────────────────────────────────────────────────
  const overviewData = [
    { Metric: "Total Households Surveyed", Value: totalRespondents },
    { Metric: "Completion Rate (%)", Value: completionRate },
    { Metric: "High Risk Households", Value: highRiskHouseholds ?? 0 },
    { Metric: "4Ps Beneficiaries (%)", Value: fourPsPercentage },
  ]
  const overviewSheet = XLSX.utils.json_to_sheet(overviewData)
  overviewSheet["!cols"] = [{ wch: 35 }, { wch: 20 }]
  XLSX.utils.book_append_sheet(workbook, overviewSheet, "Overview")

  // ── Sheet 2: Risk Recency Distribution ────────────────────────────────────
  const recencySheet = XLSX.utils.json_to_sheet(
    recencyData.map((r) => ({
      "Recency Type": r.type,
      "Total Cases": r.total,
    }))
  )
  recencySheet["!cols"] = [{ wch: 25 }, { wch: 15 }]
  XLSX.utils.book_append_sheet(workbook, recencySheet, "Risk Recency")

  // ── Sheet 3: Category Risk Distribution ───────────────────────────────────
  const categorySheet = XLSX.utils.json_to_sheet(
    categoryData.map((c) => ({
      Category: c.name,
      "Recent Cases (Within the Year)": c.value,
    }))
  )
  categorySheet["!cols"] = [{ wch: 25 }, { wch: 30 }]
  XLSX.utils.book_append_sheet(workbook, categorySheet, "Category Distribution")

  // ── Sheet 4: Top 5 Vulnerabilities ────────────────────────────────────────
  const topRisksSheet = XLSX.utils.json_to_sheet(
    topFiveRisks.map((r, i) => ({
      Rank: i + 1,
      Vulnerability: r.text,
      "Report Count": r.count,
    }))
  )
  topRisksSheet["!cols"] = [{ wch: 8 }, { wch: 60 }, { wch: 15 }]
  XLSX.utils.book_append_sheet(workbook, topRisksSheet, "Top 5 Vulnerabilities")

  XLSX.writeFile(workbook, `${filename}.xlsx`)
}