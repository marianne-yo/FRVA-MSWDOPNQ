"use client"

import React, { useEffect, useState, useMemo } from 'react'
import { Barangay } from '@/app/lib/barangay'
import { supabase } from '@/lib/supabase/client'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

type FamilyInformationProps = {
  selectedBarangay: Barangay | null
}

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

type SortDirection = 'asc' | 'desc' | null

const PAGE_SIZE = 10

function getPageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: (number | 'ellipsis')[] = []

  if (currentPage <= 3) {
    pages.push(1, 2, 3, 4, 'ellipsis', totalPages)
  } else if (currentPage >= totalPages - 2) {
    pages.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
  } else {
    pages.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages)
  }

  return pages
}

function FamilyInformation({ selectedBarangay }: FamilyInformationProps) {
  const [respondents, setRespondents] = useState<Respondent[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  useEffect(() => {
    if (!selectedBarangay) {
      setRespondents([])
      setCurrentPage(1)
      setSortDirection(null)
      return
    }

    const fetchRespondents = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('respondents')
        .select('respondent_id, name, position_family, num_children, num_families_in_hh, is_4ps_beneficiary, four_ps_since, barangay')
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
    setCurrentPage(1)
    setSortDirection(null)
  }, [selectedBarangay])

  
  const handleNameSort = () => {
    setSortDirection((prev) => {
      if (prev === null) return 'asc'
      if (prev === 'asc') return 'desc'
      return null
    })
    setCurrentPage(1) // reset to page 1 on sort change
  }

  const sortedRespondents = useMemo(() => {
    if (sortDirection === null) return respondents
    return [...respondents].sort((a, b) => {
      const nameA = a.name.toLowerCase()
      const nameB = b.name.toLowerCase()
      if (nameA < nameB) return sortDirection === 'asc' ? -1 : 1
      if (nameA > nameB) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [respondents, sortDirection])

  if (!selectedBarangay) return (
    <Card className="w-full px-1 bg-slate-50 mb-2">
      <CardHeader>
        <CardDescription>No data available. Please select a barangay to view the data.</CardDescription>
        <CardTitle className="lg:text-5xl font-bold sm:text-3xl md:text-4xl"></CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-light text-gray-500"></p>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  )

  const totalPages = Math.ceil(sortedRespondents.length / PAGE_SIZE)
  const paginatedRespondents = sortedRespondents.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )
  const pageNumbers = getPageNumbers(currentPage, totalPages)

  const SortIcon = sortDirection === 'asc'
    ? ArrowUp
    : sortDirection === 'desc'
      ? ArrowDown
      : ArrowUpDown

  return (
    <div className="p-4">
      <h2 className="font-bold text-1.8xl mb-2">Respondents in {selectedBarangay.label}:</h2>

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
        <Card className="w-full px-5 bg-linear-to-b from-gray-50 to-gray-100 mb-2">
        <div className='min-h-[500px]'>
          <Table className="bg-blue-50 border rounded-sm shadow-sm">
            <TableCaption>A list of Respondents in each Barangay</TableCaption>
            <TableHeader>
              <TableRow className="border border-gray-500">
                {/* Sortable Name column */}
                <TableHead className="w-full p-4">
                  <button
                    onClick={handleNameSort}
                    className="flex items-center gap-1 hover:text-blue-700 transition-colors font-semibold">
                    Name
                    <SortIcon className="w-4 h-4" />
                  </button>
                  <span className="text-[0.7rem]"><i>(Pangalan)</i></span>
                </TableHead>
                <TableHead className="text-center">
                  Position in the Family <br /><span className="text-[0.7rem]"><i>(Posisyon sa Pamilya)</i></span>
                </TableHead>
                <TableHead className="text-center">
                  Number of Children <br /><span className="text-[0.7rem]"><i>(Bilang ng Anak)</i></span>
                </TableHead>
                <TableHead className="text-center">
                  Number of Families in the Household <br /><span className="text-[0.7rem]"><i>(Bilang ng pamilya sa bahay)</i></span>
                </TableHead>
                <TableHead className="text-center border-2 border-gray-800">
                  4Ps Beneficiary <br /><span className="text-[0.7rem]"><i>(4P's Beneficiary ba?)</i></span>
                </TableHead>
                <TableHead className="text-center border-2 border-gray-800">
                  If YES, since when? <br /><span className="text-[0.7rem]"><i>(Kung OO Kailan Pa?)</i></span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border border-gray-500">
              {paginatedRespondents.map((r) => (
                <TableRow key={r.respondent_id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="font-medium text-center bg-amber-200">{r.position_family}</TableCell>
                  <TableCell className="font-medium text-center">{r.num_children}</TableCell>
                  <TableCell className="font-medium text-center">{r.num_families_in_hh}</TableCell>
                  <TableCell className={`font-medium text-center border-2 border-gray-800 ${r.is_4ps_beneficiary ? 'text-green-500' : 'text-red-500   '}` }>
                    {r.is_4ps_beneficiary ? "Yes" : "No"}
                  </TableCell>
                  <TableCell className="font-medium text-center border-2 border-gray-800">
                    {r.four_ps_since ?? "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

          {/* Pagination */}
          <div className="flex items-center justify-between py-4 px-2">
            <Pagination className=' flex justify-between'>
            <p className="text-sm text-gray-500 ">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, sortedRespondents.length)} of {sortedRespondents.length} respondents
            </p>
              <PaginationContent>

                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) setCurrentPage((p) => p - 1)
                    }}
                    aria-disabled={currentPage === 1}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}/>
                </PaginationItem>

                {pageNumbers.map((page, index) =>
                  page === 'ellipsis' ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === page}
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(page)
                        }}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) setCurrentPage((p) => p + 1)
                    }}
                    aria-disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}/>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </Card>
      )}
    </div>
  )
}

export default FamilyInformation
