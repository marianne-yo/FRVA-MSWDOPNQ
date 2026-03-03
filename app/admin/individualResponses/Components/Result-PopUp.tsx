'use client'

import React, { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type Respondent = {
  respondent_id: string
  name: string
  position_family: string
  num_children: number
  num_families_in_hh: number
  is_4ps_beneficiary: boolean
  four_ps_since: number
  barangay: string
}

type ResultPopUpProps = {
  respondent: Respondent
  onClose: () => void
}

type Response = {
  response_id: string
  respondent_id: string
  choice: string
  questions: {
    q_id: number
    category: string
    question_text: string
    question_text_tagalog: string
    indicator_number: number
  }
}

const CHOICE_LABELS: Record<string, string> = {
  WITHIN_THE_YEAR: "Within the Year",
  TWO_FIVE_YEARS_AGO: "2-5 Years Ago",
  NONE: "None",
}

export default function ResultPopUp({ respondent, onClose }: ResultPopUpProps) {
  const [loading, setLoading] = useState(true)
  const [responses, setResponses] = useState<Response[]>([])

  useEffect(() => {
    const fetchResponses = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from("responses")
        .select(`
          response_id,
          respondent_id,
          choice,
          questions!inner (
            q_id,
            category,
            question_text,
            question_text_tagalog,
            indicator_number
          )
        `)
        .eq("respondent_id", respondent.respondent_id)  

      if (error) {
        console.error("Error fetching responses:", error.message)
        setResponses([])
      } else {
        setResponses((data as unknown as Response[]) || [])
      }

      setLoading(false)
    }

    fetchResponses()
  }, [respondent.respondent_id])

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="relative bg-gray-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl p-8 border-2 border-gray-200">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl font-bold"
        >
          ✕
        </button>

        {/* Respondent Info */}
        <h2 className="font-light">Respondent Information</h2>
        <h2 className="text-2xl font-bold mb-2">
          {respondent.name} 
        </h2>

        <div className="mb-2 space-y-1 text-sm">
          <p><strong>Barangay:</strong> {respondent.barangay ?? "N/A"}</p>
          <p><strong>Position:</strong> {respondent.position_family}</p>
          <p><strong>Children:</strong> {respondent.num_children}</p>
          <p><strong>4PS Beneficiary: </strong>{respondent.is_4ps_beneficiary ? "Yes" : "No"}</p>
        </div>

        <h3 className="text-xl font-semibold border-b pb-2 mb-4">
          Part I. Individual Life Cycle Risks
        </h3>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-6 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          responses
            .sort(
              (a, b) =>
                a.questions.indicator_number -
                b.questions.indicator_number
            )
            .map((r) => (
              <Card key={r.response_id} className="mb-3">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {r.questions.indicator_number}.{" "}
                    {r.questions.question_text}
                  </CardTitle>
                  <CardDescription>
                    <i>({r.questions.question_text_tagalog})</i>
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-base font-semibold">
                    Answer: {CHOICE_LABELS[r.choice] ?? r.choice}
                  </p>
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  )
}