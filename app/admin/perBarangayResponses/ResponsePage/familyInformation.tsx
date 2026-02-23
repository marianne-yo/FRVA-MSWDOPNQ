"use client"

import React, { useEffect, useState } from 'react'
import { Barangay } from '@/app/lib/barangay'
import { supabase } from '@/lib/supabase/client'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Skeleton } from "@/components/ui/skeleton"
type FamilyInformationProps = {
  selectedBarangay: Barangay | null
}

type Respondent = {
  respondent_id: string
  name: string
  position_family:string
  num_children: number
  num_families_in_hh:number
  is_4ps_beneficiary: boolean
  four_ps_since:number
  barangay: string
}

function FamilyInformation({ selectedBarangay }: FamilyInformationProps) {
  const [respondents, setRespondents] = useState<Respondent[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedBarangay) {
      setRespondents([])
      return
    }

    const fetchRespondents = async () => {
      setLoading(true)
const { data, error } = await supabase
  .from('respondents')
  .select('respondent_id, name,position_family,num_children,num_families_in_hh,is_4ps_beneficiary,four_ps_since, barangay')
  .eq('barangay', selectedBarangay.value)

      if (error) {
        console.error('Error fetching respondents:', error.message)
        setRespondents([])
      } else {
        setRespondents(data || [])
      }

      setLoading(false)
    }

    fetchRespondents()
  }, [selectedBarangay])

  if (!selectedBarangay) return <p>Please select a barangay.</p>

  return (
    <div className=" p-4">
      <h2 className="font-bold mb-2">Respondents in {selectedBarangay.label}</h2>
      {loading ? (
    <div className="flex w-full flex-col gap-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div className="flex gap-4 w-full mt-2" key={index}>
          <Skeleton className="h-4 flex-1 bg-gray-200" />
          <Skeleton className="h-4 w-full bg-gray-200" />
          <Skeleton className="h-4 w-full bg-gray-200" />
        </div>
      ))}
    </div>
      ) : respondents.length === 0 ? (
        <p>No respondents found.</p>
      ) : (
    <Table className='bg-blue-100'>
      <TableCaption>A list of Respondents in each Barangay</TableCaption>
      <TableHeader>
        <TableRow className='border-3 border-gray-500'>
          <TableHead className="w-full p-4">Name <br /><span className='text-[0.7rem]'><i>(Pangalan)</i></span></TableHead>
          <TableHead className="text-center">Position in the Family <br /><span className='text-[0.7rem]'><i>(Posisyon sa Pamilya)</i></span></TableHead>
          <TableHead className="text-center">Number of Children <br /><span className='text-[0.7rem]'><i>(Bilang ng Anak)</i></span></TableHead>
          <TableHead className="text-center">Number of Families in the Household <br /><span className='text-[0.7rem]'><i>(Bilang ng pamilya sa bahay)</i></span></TableHead>
          <TableHead className="text-center border-3 border-gray-800">4Ps Beneficiary <br /><span className='text-[0.7rem]'><i>(4P's Beneficiary ba?)</i></span></TableHead>
          <TableHead className="text-center border-3 border-gray-800">If YES, since when?<br /><span className='text-[0.7rem]'><i>(Kung OO Kailan Pa?)</i></span></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className='border-3 border-gray-500'>
        {respondents.map((r) => (
          <TableRow key={r.respondent_id}>
            <TableCell className="font-medium">{r.name}</TableCell>
            <TableCell className="font-medium text-center">{r.position_family}</TableCell>
            <TableCell className="font-medium text-center">{r.num_children}</TableCell>
            <TableCell className="font-medium text-center">{r.num_families_in_hh}</TableCell>
            <TableCell className="font-medium text-center border-3 border-gray-800">{r.is_4ps_beneficiary ? "Yes":"No"}</TableCell>
            <TableCell className="font-medium text-center border-3 border-gray-800">{r.four_ps_since}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
      )}



    </div>
  )
}

export default FamilyInformation