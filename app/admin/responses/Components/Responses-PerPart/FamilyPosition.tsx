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
  position_family: string;
};

function FamilyPositionSummary() {
  const [respondents, setRespondents] = useState<Respondent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const { data, error } = await supabase
        .from("respondents")
        .select("respondent_id, position_family");

      if (error) {
        console.error(error);
      } else {
        setRespondents(data || []);
      }
      setLoading(false);
    };

    fetchAll();
  }, []);

  const positionCounts = respondents.reduce<Record<string, number>>(
    (acc, r) => {
      acc[r.position_family] = (acc[r.position_family] ?? 0) + 1;
      return acc;
    },
    {},
  );

  const chartData = Object.entries(positionCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([position, count]) => ({
      label: position,
      value: count,
    }));

  return (
    <div className="p-4">
      <h2 className="scroll-m-20 border-b pb-2 text-4xl font-semibold tracking-tight first:mt-0 mb-5">
        Position in the Family Summary
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
          title="Position in the Family"
          description={`${respondents.length} total respondents`}
          data={chartData}
          dataLabel="Respondents"
        />
      )}
    </div>
  );
}

export default FamilyPositionSummary;
