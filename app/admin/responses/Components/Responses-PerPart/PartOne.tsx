"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChartComponent } from "../Barchart";

type AggregatedRow = {
  q_id: number;
  question_text: string;
  question_text_tagalog: string;
  indicator_number: number;
  choice: string;
  count: number;
};

type GroupedQuestion = {
  q_id: number;
  question_text: string;
  question_text_tagalog: string;
  indicator_number: number;
  totalResponses: number;
  choiceCounts: Record<string, number>;
};

const CHOICE_ORDER = ["WITHIN_THE_YEAR", "TWO_FIVE_YEARS_AGO", "NONE"];

const CHOICE_LABELS: Record<string, string> = {
  WITHIN_THE_YEAR: "Within the Year",
  TWO_FIVE_YEARS_AGO: "2-5 Years Ago",
  NONE: "None",
};

function PartOne() {
  const [loading, setLoading] = useState(true);
  const [grouped, setGrouped] = useState<GroupedQuestion[]>([]);

  useEffect(() => {
    const fetchPart1Responses = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.rpc("get_part1_choice_counts");

        if (error) {
          console.error("Supabase RPC error:", error);
          return;
        }

        const map = new Map<number, GroupedQuestion>();
        for (const row of (data as AggregatedRow[])) {
          if (!map.has(row.q_id)) {
            map.set(row.q_id, {
              q_id: row.q_id,
              question_text: row.question_text,
              question_text_tagalog: row.question_text_tagalog,
              indicator_number: row.indicator_number,
              totalResponses: 0,
              choiceCounts: {},
            });
          }
          const group = map.get(row.q_id)!;
          group.choiceCounts[row.choice] = Number(row.count);
          group.totalResponses += Number(row.count);
        }

        setGrouped(
          Array.from(map.values()).sort(
            (a, b) => a.indicator_number - b.indicator_number
          )
        );
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPart1Responses();
  }, []);

  return (
    <div className="text-black">
      <h2 className="scroll-m-20 border-b pb-2 text-4xl font-semibold tracking-tight first:mt-0 mb-5">
        Part I. Individual Life Cycle Risks
      </h2>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="w-full px-1 bg-slate-50">
              <CardHeader>
                <Skeleton className="h-7 w-3/4 mb-2 bg-slate-200" />
                <Skeleton className="h-4 w-1/2 mb-1 bg-slate-200" />
                <Skeleton className="h-4 w-20 bg-slate-200" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full rounded-md bg-slate-200" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        grouped.map((group) => (
          <Card key={group.q_id} className="w-full px-1 bg-slate-50 mb-2">
            <CardHeader>
              <CardTitle className="lg:text-2xl md:text-xl text-[0.8rem]">
                {group.indicator_number}. {group.question_text}
              </CardTitle>
              <CardDescription>
                <i>({group.question_text_tagalog})</i>
              </CardDescription>
              <CardDescription>
                <i>{group.totalResponses}</i> Responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChartComponent
                data={CHOICE_ORDER.map((choice) => ({
                  label: CHOICE_LABELS[choice] ?? choice,
                  value: group.choiceCounts[choice] ?? 0,
                }))}
                dataLabel="Responses"
                tickFormatter={(value) => value}
              />
            </CardContent>
            <CardFooter>{/* Footer */}</CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}

export default PartOne;