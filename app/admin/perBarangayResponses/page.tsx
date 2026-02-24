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

export default function perBarangay() {
  const [selectedBarangay, setSelectedBarangay] = useState<Barangay | null>(
    null,
  );

  const [respondentCount, setRespondentCount] = useState(0);

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
    <main>
      <h1 className="font-black text-3xl py-5 px-2">PER BARANGAY RESPONSES</h1>
      <Separator />
      <br />
      <div className="relative">
      <TabsLine>
        <div className="absolute right-10 top-1.5">
          <ComboboxPopup
            value={selectedBarangay}
            onChange={setSelectedBarangay}
          />
        </div>
        <div className="flex flex-row"></div>

        <Card className="w-full px-1 bg-slate-50 mb-2">
          <CardHeader>
            <CardDescription>Total Respondents</CardDescription>
            <CardTitle className="lg:text-5xl font-bold sm:text-3xl md:text-4xl">
              {respondentCount}
            </CardTitle>
            {/* <CardAction>Card Action</CardAction> */}
          </CardHeader>
          <CardContent>
            <p className="text-sm font-light text-gray-500">
              Total number of responses out of ≈30,000 households
            </p>
          </CardContent>
          <CardFooter>
            <p>
              Barangay:{" "}
              <span className="font-bold text-blue-500">
                {selectedBarangay ? selectedBarangay.label : "None"}
              </span>
            </p>
          </CardFooter>
        </Card>
        <Separator />

        <TabsContent value="FamilyInformation">
          <FamilyInformation selectedBarangay={selectedBarangay} />
        </TabsContent>
        <TabsContent value="Part1">
          <PartOne selectedBarangay={selectedBarangay} />
        </TabsContent>
        <TabsContent value="Part2">Part 2 content</TabsContent>
        <TabsContent value="Part3">Part 3 content</TabsContent>
        <TabsContent value="Part4">Part 4 content</TabsContent>
      </TabsLine>
</div>
      {/* <MyBarChart/> */}
    </main>
  );
}
