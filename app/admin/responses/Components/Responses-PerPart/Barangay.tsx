"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChartComponent } from "../Barchart";

type Respondent = {
  respondent_id: string;
  barangay: string;
};

function BarangayResponses() {
  const [respondents, setRespondents] = useState<Respondent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllBarangay = async () => {
      const { data, error } = await supabase
        .from("respondents")
        .select("respondent_id, barangay");

      if (error) {
        console.error(error);
      } else {
        setRespondents(data || []);
      }
      setLoading(false);
    };

    fetchAllBarangay();
  }, []);

  // count per barangay
  const barangayCounts = respondents.reduce<Record<string, number>>(
    (acc, r) => {
      acc[r.barangay] = (acc[r.barangay] ?? 0) + 1;
      return acc;
    },
    {},
  );

  const chartData = Object.entries(barangayCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([barangay, count]) => ({
      label: barangay,
      value: count,
    }));

  return (
    <div className="p-4">
      <h2 className="scroll-m-20 border-b pb-2 text-4xl font-semibold tracking-tight first:mt-0 mb-5">
        Respondents per Barangay
      </h2>

      {loading ? (
        <Card className="w-full px-1 bg-slate-50">
          <CardHeader>
            <Skeleton className="h-7 w-3/4 mb-2 bg-slate-200" />
            <Skeleton className="h-4 w-1/2 bg-slate-200" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full rounded-md bg-slate-200" />
          </CardContent>
        </Card>
      ) : (
        <BarChartComponent
          title="Total Respondents per Barangay"
          description={`${respondents.length} total respondents across ${chartData.length} barangays`}
          data={chartData}
          dataLabel="Respondents"
        />
      )}
    </div>
  );
}

export default BarangayResponses;
