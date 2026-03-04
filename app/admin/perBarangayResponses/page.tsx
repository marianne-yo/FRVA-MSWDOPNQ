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

export default function PerBarangay() {
  const [selectedBarangay, setSelectedBarangay] = useState<Barangay | null>(
    null,
  );

  const [respondentCount, setRespondentCount] = useState(0);
  const [totalRespondents, setTotalRespondents] = useState(0);
  // const [totalResponses, setTotalResponses] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const { count: respondentCount } = await supabase
        .from("respondents")
        .select("*", { count: "exact", head: true });

      const { count: responsesCount } = await supabase
        .from("responses")
        .select("*", { count: "exact", head: true });

      setTotalRespondents(respondentCount || 0);
      // setTotalResponses(responsesCount || 0);
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
    <main className="px-20">
      <h1 className="font-black text-3xl py-5 px-2">PER BARANGAY RESPONSES</h1>
      <Separator />
      <br />
      <div className="relative w-full">
        {/*Menu Tabs*/}
        <TabsLine>
          <div className="absolute right-10 top-1.5">
            <ComboboxPopup
              value={selectedBarangay}
              onChange={setSelectedBarangay}/>
          </div>
          <div className="flex flex-row"></div>

          <Card className="w-full px-5 bg-linear-to-b from-gray-50 to-gray-100 mb-2">
            <CardHeader>
              <p className="text-[1rem]">
                <span className="font-bold text-amber-500 text-xl">
                  {selectedBarangay ? selectedBarangay.label.toUpperCase() : "None"}
                </span>
              </p>

              <CardDescription>Total Respondents</CardDescription>
              
              {/* <CardAction>Card Action</CardAction> */}
            </CardHeader>
            <CardContent>
              <CardTitle className="lg:text-5xl font-bold sm:text-3xl md:text-4xl">

                {respondentCount}
                <span className="text-gray-500 p-2 text-[1.5rem]">
                  ({totalRespondents > 0
                    ? ((respondentCount / totalRespondents) * 100).toFixed(2)
                    : "0.00"}%)
                </span>
                <span className=" text-gray-500 text-[2rem]">out of </span>
                
                <span className="text-gray-500">{totalRespondents}</span>

              </CardTitle>
            </CardContent>
            <CardContent>
              <p className="text-sm font-light text-gray-500">
                Total number of responses out of ≈30,000 households
              </p>
            </CardContent>
          </Card>
          <Separator />

        {/* Menu Tabs (Output Area) */}
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
      {/* <MyBarChart/> */}
    </main>
  );
}
