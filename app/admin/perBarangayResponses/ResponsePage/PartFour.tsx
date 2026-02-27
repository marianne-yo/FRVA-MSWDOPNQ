"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Barangay } from "@/app/lib/barangay";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import GraphResponse from "../Components/graphs";
import { Skeleton } from "@/components/ui/skeleton";

type BarangaySelected = {
  selectedBarangay: Barangay | null;
};

type Response = {
  response_id: string;
  respondent_id: string;
  q_id: number;
  choice: string;
  questions: {
    q_id: number;
    category: string;
    question_text: string;
    question_text_tagalog: string;
    indicator_number: number;
  };
  respondents: {
    respondent_id: string;
    barangay: string;
    name: string;
  };
};

type GroupedQuestion = {
  q_id: number;
  question_text: string;
  question_text_tagalog: string;
  indicator_number: number;
  responses: Response[];
  choiceCounts: Record<string, number>;
};

const CHOICE_ORDER = ["WITHIN_THE_YEAR", "TWO_FIVE_YEARS_AGO", "NONE"];

function groupByQuestion(responses: Response[]): GroupedQuestion[] {
  const map = new Map<number, GroupedQuestion>();

  for (const r of responses) {
    const qid = r.questions.q_id;
    if (!map.has(qid)) {
      map.set(qid, {
        q_id: qid,
        question_text: r.questions.question_text,
        question_text_tagalog: r.questions.question_text_tagalog,
        indicator_number: r.questions.indicator_number,
        responses: [],
        choiceCounts: {},
      });
    }
    const group = map.get(qid)!;
    group.responses.push(r);
    // This is where the count per choice happens
    group.choiceCounts[r.choice] = (group.choiceCounts[r.choice] ?? 0) + 1;
  }

  return Array.from(map.values()).sort(
    (a, b) => a.indicator_number - b.indicator_number,
  );
}

function PartFour({ selectedBarangay }: BarangaySelected) {
  const [response, setResponse] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPart1Responses = async () => {
      if (!selectedBarangay) return;

      const { data, error } = await supabase
        .from("responses")
        .select(
          `
          response_id,
          respondent_id,
          q_id,
          choice,
          questions!inner (
            q_id,
            category,
            question_text,
            indicator_number,
            question_text_tagalog
          ),
          respondents!inner (
            respondent_id,
            barangay,
            name
          )
        `,
        )
        .eq("questions.category", "SocGov")
        .eq("respondents.barangay", selectedBarangay.value);

      if (error) {
        console.error(error);
        setLoading(false);
      } else {
        setResponse((data as unknown as Response[]) || []);
        setLoading(false);
      }
    };

    fetchPart1Responses();
  }, [selectedBarangay]);

  const grouped = groupByQuestion(response);

  return (
    <div className="text-black">
      <h2 className="scroll-m-20 border-b pb-2 text-4xl font-semibold tracking-tight first:mt-0 mb-5">
        Part IV. Social and Governance Risks
      </h2>

      {loading ? (
        // Loading Skeleto
        <div className="flex flex-col gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="w-full px-1 bg-slate-50">
              <CardHeader>
                <Skeleton className="h-7 w-3/4 mb-2  bg-slate-200" />
                <Skeleton className="h-4 w-1/2 mb-1 bg-slate-200" />
                <Skeleton className="h-4 w-20 bg-slate-200" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full rounded-md bg-slate-200" />
              </CardContent>
              s
            </Card>
          ))}
        </div>
      ) : (
        // Card
        grouped.map((group) => (
          <Card key={group.q_id} className="w-full px-1 bg-slate-50 mb-2">
            <CardHeader>
              <CardTitle className="lg:text-3xl md:text-2xl text-[1rem]">
                {group.indicator_number}. {group.question_text}
              </CardTitle>
              <CardDescription>
                <i>({group.question_text_tagalog})</i>
              </CardDescription>
              <CardDescription>
                <i>{group.responses.length}</i> Responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 text-sm">
                <GraphResponse
                  choiceCounts={group.choiceCounts}
                  choiceOrder={CHOICE_ORDER}
                />
              </div>
            </CardContent>
            <CardFooter>{/* Footer */}</CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}

export default PartFour;
