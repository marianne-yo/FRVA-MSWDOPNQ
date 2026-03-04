"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChartComponent } from "../Barchart";

type Respondent = {
  respondent_id: string;
  num_families_in_hh: number;
};

function NumFamiliesInHHSummary() {
  const [respondents, setRespondents] = useState<Respondent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const { data, error } = await supabase
        .from("respondents")
        .select("respondent_id, num_families_in_hh");

      if (error) {
        console.error(error);
      } else {
        setRespondents(data || []);
      }
      setLoading(false);
    };

    fetchAll();
  }, []);

  const familyCounts = respondents.reduce<Record<string, number>>((acc, r) => {
    const key = String(r.num_families_in_hh);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(familyCounts)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([num, count]) => ({
      label: `${num} ${Number(num) === 1 ? "family" : "families"}`,
      value: count,
    }));

  return (
    <div className="p-4">
      <h2 className="scroll-m-20 border-b pb-2 text-4xl font-semibold tracking-tight first:mt-0 mb-5">
        Number of Families in Household Summary
      </h2>

      {loading ? (
        <Card className="w-full px-1 bg-slate-50">
          <CardHeader>
            <Skeleton className="h-7 w-3/4 mb-2 bg-slate-200" />
            <Skeleton className="h-4 w-1/2 bg-slate-200" />
          </CardHeader>
          <Skeleton className="h-40 w-full rounded-md bg-slate-200" />
        </Card>
      ) : (
        <BarChartComponent
          title="Number of Families in Household"
          description={`${respondents.length} total respondents`}
          data={chartData}
          dataLabel="Respondents"
        />
      )}
    </div>
  );
}

export default NumFamiliesInHHSummary;
