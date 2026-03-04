"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChartComponent } from "../Barchart";

type Respondent = {
  respondent_id: string;
  is_4ps_beneficiary: boolean;
};

function FourPsSummary() {
  const [respondents, setRespondents] = useState<Respondent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const { data, error } = await supabase
        .from("respondents")
        .select("respondent_id, is_4ps_beneficiary");

      if (error) {
        console.error(error);
      } else {
        setRespondents(data || []);
      }
      setLoading(false);
    };

    fetchAll();
  }, []);

  const chartData = [
    {
      label: "Yes",
      value: respondents.filter((r) => r.is_4ps_beneficiary).length,
    },
    {
      label: "No",
      value: respondents.filter((r) => !r.is_4ps_beneficiary).length,
    },
  ];

  return (
    <div className="p-4">
      <h2 className="scroll-m-20 border-b pb-2 text-4xl font-semibold tracking-tight first:mt-0 mb-5">
        4Ps Beneficiary Summary
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
          title="4Ps Beneficiary"
          description={`${respondents.length} total respondents`}
          data={chartData}
          dataLabel="Respondents"
        />
      )}
    </div>
  );
}

export default FourPsSummary;
