"use client";

import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { Barangay } from "@/app/lib/barangay";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
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

export default function PerBarangay() {
  const [selectedBarangay, setSelectedBarangay] = useState<Barangay | null>(null);
  const [respondentCount, setRespondentCount] = useState(0);
  const [totalRespondents, setTotalRespondents] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch total respondents on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count: respondentCount } = await supabase
          .from("respondents")
          .select("*", { count: "exact", head: true });

        setTotalRespondents(respondentCount || 0);
      } catch (err) {
        console.error("Error fetching total respondents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Fetch respondent count for selected barangay
  useEffect(() => {
    if (!selectedBarangay) {
      setRespondentCount(0);
      return;
    }

    const fetchData = async () => {
      try {
        const { count } = await supabase
          .from("respondents")
          .select("*", { count: "exact", head: true })
          .eq("barangay", selectedBarangay.value);

        setRespondentCount(count || 0);
      } catch (err) {
        console.error("Error fetching barangay respondents:", err);
        setRespondentCount(0);
      }
    };

    fetchData();
  }, [selectedBarangay]);

  // Calculate percentage
  const percentage =
    totalRespondents > 0
      ? ((respondentCount / totalRespondents) * 100).toFixed(2)
      : "0.00";

  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-black text-4xl md:text-5xl text-slate-900 mb-2">
            PER BARANGAY RESPONSES
          </h1>
          <p className="text-slate-600">
            View respondent data and survey responses by barangay
          </p>
        </div>

        <Separator className="mb-8" />

        {/* Barangay Selector and Stats Card */}
        <div className="space-y-6 mb-8">
          {/* Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">
                Select Barangay
              </label>
              <ComboboxPopup value={selectedBarangay} onChange={setSelectedBarangay} />
            </div>
          </div>

          {/* Stats Card */}
          <Card className="w-full border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl md:text-3xl text-slate-900">
                    {selectedBarangay ? selectedBarangay.label.toUpperCase() : "NO BARANGAY SELECTED"}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Total Respondents in Selected Barangay
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Main Stat */}
              <div className="space-y-2">
                <p className="text-slate-600 text-sm font-medium">
                  Respondent Count
                </p>
                <div className="flex flex-wrap items-baseline gap-2 md:gap-3">
                  <span className="text-5xl md:text-6xl font-black text-slate-900">
                    {respondentCount}
                  </span>
                  <span className="text-sm md:text-base text-slate-600">
                    respondents
                  </span>
                  <span className="text-lg md:text-xl font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                    {percentage}%
                  </span>
                </div>
              </div>

              {/* Percentage Breakdown */}
              <div className="pt-4 border-t border-slate-200">
                <p className="text-slate-600 text-sm font-medium mb-3">
                  Percentage of Total Respondents
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 text-sm">
                      {selectedBarangay ? selectedBarangay.label : "Selected Barangay"}
                    </span>
                    <span className="font-semibold text-slate-900">{percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${parseFloat(percentage)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 pt-2">
                    <span>0</span>
                    <span>{totalRespondents}</span>
                  </div>
                </div>
              </div>

              {/* Total Info */}
              <div className="pt-4 border-t border-slate-200 bg-slate-50 -mx-6 px-6 py-4">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">{respondentCount}</span> out of{" "}
                  <span className="font-semibold text-slate-900">{totalRespondents}</span> total
                  respondents
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Based on approximately 30,000 households in the municipality
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="mb-8" />

        {/* Tabs Content */}
        <TabsLine>
          <TabsContent value="FamilyInformation" className="mt-6">
            <FamilyInformation selectedBarangay={selectedBarangay} />
          </TabsContent>

          <TabsContent value="Part1" className="mt-6">
            <PartOne selectedBarangay={selectedBarangay} />
          </TabsContent>

          <TabsContent value="Part2" className="mt-6">
            <PartTwo selectedBarangay={selectedBarangay} />
          </TabsContent>

          <TabsContent value="Part3" className="mt-6">
            <PartThree selectedBarangay={selectedBarangay} />
          </TabsContent>

          <TabsContent value="Part4" className="mt-6">
            <PartFour selectedBarangay={selectedBarangay} />
          </TabsContent>
        </TabsLine>
      </div>
    </main>
  );
}
