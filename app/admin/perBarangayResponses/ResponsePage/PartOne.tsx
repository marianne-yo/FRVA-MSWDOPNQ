'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Barangay } from '@/app/lib/barangay'
import { Card, CardHeader, CardDescription, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import GraphResponse from '../Components/graphs'


type BarangaySelected = {
  selectedBarangay: Barangay | null
}

type Response = {
  response_id: string
  respondent_id: string
  q_id: number
  choice: string
  questions: {
    q_id: number
    category: string
    question_text: string
    question_text_tagalog: string
    indicator_number: number
  }
  respondents: {
    respondent_id: string
    barangay: string
    name: string
  }
}

type GroupedQuestion = {
  q_id: number
  question_text: string
  question_text_tagalog: string
  indicator_number: number
  responses: Response[]
  choiceCounts: Record<string, number>
}

const CHOICE_ORDER = [
  'WITHIN_THE_YEAR',
  'TWO_FIVE_YEARS_AGO',
  'NONE',
]

function groupByQuestion(responses: Response[]): GroupedQuestion[] {
  const map = new Map<number, GroupedQuestion>()

  for (const r of responses) {
    const qid = r.questions.q_id
    if (!map.has(qid)) {
      map.set(qid, {
        q_id: qid,
        question_text: r.questions.question_text,
        question_text_tagalog: r.questions.question_text_tagalog,
        indicator_number: r.questions.indicator_number,
        responses: [],
        choiceCounts: {},
      })
    }
    const group = map.get(qid)!
    group.responses.push(r)
    // This is where the count per choice happens
    group.choiceCounts[r.choice] = (group.choiceCounts[r.choice] ?? 0) + 1
  }

  return Array.from(map.values()).sort((a, b) => a.indicator_number - b.indicator_number)
}

function PartOne({ selectedBarangay }: BarangaySelected) {
  const [response, setResponse] = useState<Response[]>([])

  useEffect(() => {
    const fetchPart1Responses = async () => {
      if (!selectedBarangay) return

      const { data, error } = await supabase
        .from('responses')
        .select(`
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
        `)
        .eq('questions.category', 'Individual')
        .eq('respondents.barangay', selectedBarangay.value)

      if (error) {
        console.error(error)
      } else {
        setResponse(data as unknown as Response[] || [])
      }
    }

    fetchPart1Responses()
  }, [selectedBarangay])

  const grouped = groupByQuestion(response)

  return (
    <div className='text-black'>
      <h1>Part 1. Individual Life Cycle Risks</h1>
      
      {grouped.map((group) => (
        <Card
          key={group.q_id}
          className="w-full px-1 bg-slate-50 mb-2"
        >
          <CardHeader>
            <CardTitle className='lg:text-3xl md:text-2xl text-[1rem]'>
              {group.indicator_number}. {group.question_text}
            </CardTitle>
            <CardDescription><i>({group.question_text_tagalog})</i></CardDescription>
            <CardDescription><i>{group.responses.length}</i> Responses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 text-sm">
              {/* {CHOICE_ORDER.map((choice) => {
                const count = group.choiceCounts[choice] ?? 0
                return (
                  <div key={choice} className="flex justify-between">
                    <span>{choice}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                )
              })} */}
              <GraphResponse choiceCounts={group.choiceCounts} choiceOrder={CHOICE_ORDER} />
            </div>
          </CardContent>
          <CardFooter>
            {/* Footer */}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default PartOne