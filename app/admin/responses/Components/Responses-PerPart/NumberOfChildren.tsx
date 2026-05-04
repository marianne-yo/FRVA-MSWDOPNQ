"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChartComponent } from "../Barchart";

type Respondent = {
  respondent_id: string;
  num_children: number;
};

function NumChildrenSummary() {
  const [respondents, setRespondents] = useState<Respondent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const PAGE_SIZE = 1000;
      let allData: Respondent[] = [];
      let from = 0;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabase
          .from("respondents")
          .select("respondent_id, num_children")
          .range(from, from + PAGE_SIZE - 1);

        if (error) {
          console.error(error);
          break;
        }

        if (data && data.length > 0) {
          allData = [...allData, ...data];
          from += PAGE_SIZE;
          hasMore = data.length === PAGE_SIZE;
        } else {
          hasMore = false;
        }
      }

      setRespondents(allData);
      setLoading(false);
    };

    fetchAll();
  }, []);

  const childrenCounts = respondents.reduce<Record<string, number>>(
    (acc, r) => {
      const key = String(r.num_children);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {},
  );

  const chartData = Object.entries(childrenCounts)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([num, count]) => ({
      label: `${num} ${Number(num) === 1 ? "child" : "children"}`,
      value: count,
    }));

  return (
    <div className="p-4">
      <h2 className="scroll-m-20 border-b pb-2 text-4xl font-semibold tracking-tight first:mt-0 mb-5">
        Number of Children Summary
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
          title="Number of Children"
          description={`${respondents.length} total respondents`}
          data={chartData}
          dataLabel="Respondents"
        />
      )}
    </div>
  );
}

export default NumChildrenSummary;