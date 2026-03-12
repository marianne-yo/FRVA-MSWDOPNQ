"use client";

import MyBarChart from "@/components/MyBarChart";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { Barangay } from "@/app/lib/barangay";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ComboboxPopup } from "./Components/comboBox";
import { TabsLine } from "./Components/menu";
import { TabsContent } from "@/components/ui/tabs";

import FamilyInformation from "./ResponsePage/familyInformation";
import PartOne from "./ResponsePage/PartOne";
import PartTwo from "./ResponsePage/PartTwo";
import PartThree from "./ResponsePage/PartThree";
import PartFour from "./ResponsePage/PartFour";
import * as XLSX from "xlsx"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button";

export default function PerBarangay() {
  const [selectedBarangay, setSelectedBarangay] = useState<Barangay | null>(
    null,
  );

  const [respondentCount, setRespondentCount] = useState(0);
  const [totalRespondents, setTotalRespondents] = useState(0);

  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    if (!selectedBarangay) return
    setExporting(true)

    // Sheet 1: Family Information
    const { data: familyData } = await supabase
      .from("respondents")
      .select("name, position_family, num_children, num_families_in_hh, is_4ps_beneficiary, four_ps_since, barangay")
      .eq("barangay", selectedBarangay.value)

    const familySheet = XLSX.utils.json_to_sheet(
      (familyData || []).map(r => ({
        Name: r.name,
        "Position in Family": r.position_family,
        "No. of Children": r.num_children,
        "Families in HH": r.num_families_in_hh,
        "4Ps Beneficiary": r.is_4ps_beneficiary ? "Yes" : "No",
        "4Ps Since": r.four_ps_since ?? "N/A",
        Barangay: r.barangay,
      }))
    )

    // Sheets 2-5: Vulnerability Responses per category
    const categories = [
      { name: "Part I - Individual", value: "Individual" },
      { name: "Part II - Economic", value: "Economic" },
      { name: "Part III - Env & Disaster", value: "EnvironmentDisaster" },
      { name: "Part IV - Soc & Gov", value: "SocGov" },
    ]

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, familySheet, "Family Information")

    for (const cat of categories) {
      const { data: responses } = await supabase
        .from("responses")
        .select(`
          choice,
          questions!inner ( question_text, indicator_number ),
          respondents!inner ( name, barangay )
        `)
        .eq("questions.category", cat.value)
        .eq("respondents.barangay", selectedBarangay.value) as any

      const rows = (responses || []).map((r: any) => ({
        "Respondent Name": r.respondents?.name,
        "Indicator #": r.questions?.indicator_number,
        Question: r.questions?.question_text,
        Response: r.choice === "WITHIN_THE_YEAR"
          ? "Within the Year"
          : r.choice === "TWO_FIVE_YEARS_AGO"
          ? "2-5 Years Ago"
          : "None",
      }))

      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), cat.name)
    }

    XLSX.writeFile(workbook, `${selectedBarangay.label}_responses.xlsx`)
    setExporting(false)
  }

  useEffect(() => {
    const fetchStats = async () => {
      const { count: respondentCount } = await supabase
        .from("respondents")
        .select("*", { count: "exact", head: true });

      const { count: responsesCount } = await supabase
        .from("responses")
        .select("*", { count: "exact", head: true });

      setTotalRespondents(respondentCount || 0);
    };

    fetchStats();
  }, []);

  useEffect(() => {
    if (!selectedBarangay) return;

    const fetchData = async () => {
      const { count } = await supabase
        .from("respondents")
        .select("*", { count: "exact", head: true })
        .eq("barangay", selectedBarangay.value);

      setRespondentCount(count || 0);
    };

    fetchData();
  }, [selectedBarangay]);

  return (
    <main className="overflow-x-hidden min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-row justify-between items-center">
        <h1 className="font-black text-2xl sm:text-3xl">PER BARANGAY RESPONSES</h1>
        <Button
          onClick={handleExport}
          disabled={!selectedBarangay || exporting}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium mx-4 mb-2"
        >
          <Download size={16} />
          {exporting ? "Exporting..." : "Export to Excel"}
        </Button>
      </div>

      <div className="w-full px-4 sm:px-6 py-4">
        {/* Barangay Selector - Moved to top on mobile */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Barangay
          </label>
          <ComboboxPopup
            value={selectedBarangay}
            onChange={setSelectedBarangay}
          />
        </div>

        {/* Stats Card */}
        <Card className="w-full bg-gradient-to-b from-gray-50 to-gray-100 mb-6 shadow-sm">
          <CardHeader className="pb-3">
            <p className="text-base sm:text-lg">
              <span className="font-bold text-amber-500">
                {selectedBarangay ? selectedBarangay.label.toUpperCase() : "SELECT A BARANGAY"}
              </span>
            </p>
            <CardDescription>Total Respondents</CardDescription>
          </CardHeader>

          <CardContent className="space-y-2">
            {/* Desktop - All in one line */}
            <div className="hidden sm:block">
              <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-bold">
                {respondentCount}
                <span className="text-gray-500 ml-2 text-xl sm:text-2xl md:text-3xl">
                  ({totalRespondents > 0
                    ? ((respondentCount / totalRespondents) * 100).toFixed(2)
                    : "0.00"}%)
                </span>
                <span className="text-gray-500 ml-2 text-lg sm:text-xl md:text-2xl">
                  out of {totalRespondents}
                </span>
              </CardTitle>
            </div>

            {/* Mobile - Stacked layout */}
            <div className="sm:hidden">
              <div className="mb-3">
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  Respondents
                </p>
                <CardTitle className="text-4xl font-bold">
                  {respondentCount}
                </CardTitle>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                    Percentage
                  </p>
                  <p className="text-xl font-bold text-amber-500">
                    {totalRespondents > 0
                      ? ((respondentCount / totalRespondents) * 100).toFixed(2)
                      : "0.00"}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                    Total
                  </p>
                  <p className="text-xl font-bold">
                    {totalRespondents}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardContent>
            <p className="text-xs sm:text-sm font-light text-gray-500">
              Total number of responses out of ≈30,000 households
            </p>
          </CardContent>
        </Card>

        <Separator className="my-6" />

        {/* Tabs Content */}
        <TabsLine>
          <TabsContent value="FamilyInformation">
            <FamilyInformation selectedBarangay={selectedBarangay} />
          </TabsContent>
          <TabsContent value="Part1">
            <PartOne selectedBarangay={selectedBarangay} />
          </TabsContent>
          <TabsContent value="Part2">
            <PartTwo selectedBarangay={selectedBarangay} />
          </TabsContent>
          <TabsContent value="Part3">
            <PartThree selectedBarangay={selectedBarangay} />
          </TabsContent>
          <TabsContent value="Part4">
            <PartFour selectedBarangay={selectedBarangay} />
          </TabsContent>
        </TabsLine>
      </div>
    </main>
  );
}
