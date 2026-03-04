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

  // Fetch respondents
  useEffect(() => {
    if (!selectedBarangay) return

    const fetchRespondents = async () => {
      setLoading(true)
      try {
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
      } catch (err) {
        console.error('Unexpected error:', err)
        setRespondents([])
      } finally {
        setCurrentPage(1)
        setSortDirection(null)
        setLoading(false)
      }
    }

    fetchRespondents()
  }, [selectedBarangay])

  // Handle sorting
  const handleNameSort = () => {
    setSortDirection((prev) => {
      if (prev === null) return 'asc'
      if (prev === 'asc') return 'desc'
      return null
    })
    setCurrentPage(1)
  }

  // Memoized sorted respondents
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

  // No barangay selected
  if (!selectedBarangay) {
    return (
      <Card className="w-full border-slate-200 bg-slate-50">
        <CardHeader>
          <CardTitle className="text-slate-900">No Barangay Selected</CardTitle>
          <CardDescription>Please select a barangay to view respondent data.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">
            Select a barangay from the list to see family information and respondent details.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Pagination
  const totalPages = Math.ceil(sortedRespondents.length / PAGE_SIZE)
  const paginatedRespondents = sortedRespondents.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )
  const pageNumbers = getPageNumbers(currentPage, totalPages)

  // Sort icon
  const SortIcon = sortDirection === 'asc'
    ? ArrowUp
    : sortDirection === 'desc'
      ? ArrowDown
      : ArrowUpDown

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-black text-2xl md:text-3xl text-slate-900 mb-1">
          Respondents in {selectedBarangay.label}
        </h2>
        <p className="text-slate-600">
          {respondents.length} total {respondents.length === 1 ? 'respondent' : 'respondents'}
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-16 flex-1 rounded-lg bg-slate-200" />
            </div>
          ))}
        </div>
      ) : respondents.length === 0 ? (
        /* Empty State */
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-lg text-slate-500">
              No respondents found in {selectedBarangay.label}.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-lg border border-slate-200 shadow-sm bg-white">
            <div className="overflow-x-auto">
              <Table>
                <TableCaption className="text-sm text-slate-600 py-3">
                  A list of Respondents in {selectedBarangay.label}
                </TableCaption>
                <TableHeader>
                  <TableRow className="border-b border-slate-200 bg-slate-50 hover:bg-slate-50">
                    {/* Name Column */}
                    <TableHead className="px-4 py-3 text-left">
                      <button
                        onClick={handleNameSort}
                        className="flex items-center gap-2 font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                      >
                        Name
                        <SortIcon className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-slate-500 italic block mt-1">
                        Pangalan
                      </span>
                    </TableHead>

                    {/* Position Column */}
                    <TableHead className="px-4 py-3 text-center font-semibold text-slate-700">
                      <div>Position in Family</div>
                      <span className="text-xs text-slate-500 italic">
                        Posisyon sa Pamilya
                      </span>
                    </TableHead>

                    {/* Children Column */}
                    <TableHead className="px-4 py-3 text-center font-semibold text-slate-700">
                      <div>Children</div>
                      <span className="text-xs text-slate-500 italic">
                        Bilang ng Anak
                      </span>
                    </TableHead>

                    {/* Families in HH Column */}
                    <TableHead className="px-4 py-3 text-center font-semibold text-slate-700">
                      <div>Families in HH</div>
                      <span className="text-xs text-slate-500 italic">
                        Bilang ng pamilya
                      </span>
                    </TableHead>

                    {/* 4Ps Beneficiary Column */}
                    <TableHead className="px-4 py-3 text-center font-semibold text-slate-700">
                      <div>4Ps Beneficiary</div>
                      <span className="text-xs text-slate-500 italic">
                        4P&apos;s Beneficiary ba?
                      </span>
                    </TableHead>

                    {/* 4Ps Since Column */}
                    <TableHead className="px-4 py-3 text-center font-semibold text-slate-700">
                      <div>Since When</div>
                      <span className="text-xs text-slate-500 italic">
                        Kung OO Kailan Pa?
                      </span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRespondents.map((r) => (
                    <TableRow
                      key={r.respondent_id}
                      className="border-b border-slate-200 hover:bg-blue-50 transition-colors"
                    >
                      <TableCell className="px-4 py-3 font-medium text-slate-900">
                        {r.name}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center text-slate-700">
                        {r.position_family}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center text-slate-700">
                        {r.num_children}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center text-slate-700">
                        {r.num_families_in_hh}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            r.is_4ps_beneficiary
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {r.is_4ps_beneficiary ? 'Yes' : 'No'}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center text-slate-700">
                        {r.four_ps_since ?? 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {paginatedRespondents.map((r) => (
              <Card
                key={r.respondent_id}
                className="border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-slate-900">
                    {r.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        Position
                      </p>
                      <p className="text-sm text-slate-900 mt-1">
                        {r.position_family}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        Children
                      </p>
                      <p className="text-sm text-slate-900 mt-1">
                        {r.num_children}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        Families in HH
                      </p>
                      <p className="text-sm text-slate-900 mt-1">
                        {r.num_families_in_hh}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        4Ps Beneficiary
                      </p>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          r.is_4ps_beneficiary
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {r.is_4ps_beneficiary ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                  {(r.four_ps_since || r.is_4ps_beneficiary) && (
                    <div className="pt-3 border-t border-slate-200">
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        4Ps Since
                      </p>
                      <p className="text-sm text-slate-900 mt-1">
                        {r.four_ps_since ?? 'N/A'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-600 text-center sm:text-left">
                Showing{' '}
                <span className="font-semibold">
                  {(currentPage - 1) * PAGE_SIZE + 1}
                </span>
                –
                <span className="font-semibold">
                  {Math.min(currentPage * PAGE_SIZE, sortedRespondents.length)}
                </span>{' '}
                of{' '}
                <span className="font-semibold">
                  {sortedRespondents.length}
                </span>{' '}
                respondents
              </p>
              <Pagination>
                <PaginationContent className="gap-1">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) setCurrentPage(currentPage - 1)
                      }}
                      className={`cursor-pointer ${
                        currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                      }`}
                    />
                  </PaginationItem>

                  {pageNumbers.map((page, idx) =>
                    page === 'ellipsis' ? (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === page}
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(page as number)
                          }}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                      }}
                      className={`cursor-pointer ${
                        currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
                      }`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default FamilyInformation
