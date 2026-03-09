"use client";
import { supabase } from "@/lib/supabase/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

import PartOne from "./Components/Responses-PerPart/PartOne";
import BarangayResponses from "./Components/Responses-PerPart/Barangay";
import FamilyPositionSummary from "./Components/Responses-PerPart/FamilyPosition";
import NumChildrenSummary from "./Components/Responses-PerPart/NumberOfChildren";
import NumFamiliesInHHSummary from "./Components/Responses-PerPart/NumOfHH";
import FourPsSummary from "./Components/Responses-PerPart/FourPc";
import FourPsSinceSummary from "./Components/Responses-PerPart/FourpcSince";
import PartTwo from "./Components/Responses-PerPart/PartTwo";
import PartThree from "./Components/Responses-PerPart/PartThree";
import PartFour from "./Components/Responses-PerPart/PartFour";

type Respondent = {
  respondent_id: string;
  name: string;
  position_family: string;
  num_children: number;
  num_families_in_hh: number;
  is_4ps_beneficiary: boolean;
  four_ps_since: number;
  barangay: string;
};

type SortDirection = "asc" | "desc" | null;
const PAGE_SIZE = 10;

function getPageNumbers(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [];

  if (currentPage <= 3) {
    pages.push(1, 2, 3, 4, "ellipsis", totalPages);
  } else if (currentPage >= totalPages - 2) {
    pages.push(
      1,
      "ellipsis",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    );
  } else {
    pages.push(
      1,
      "ellipsis",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis",
      totalPages,
    );
  }
  return pages;
}

export default function Response() {
  const [respondents, setRespondents] = useState<Respondent[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Fetch
  useEffect(() => {
    const fetchRespondents = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("respondents").select(`
        respondent_id,
        name,
        position_family,
        num_children,
        num_families_in_hh,
        is_4ps_beneficiary,
        four_ps_since,
        barangay`);
      if (error) {
        console.error("Error fetching respondents:", error.message);
        setRespondents([]);
      } else {
        setRespondents(data || []);
      }

      setLoading(false);
    };

    fetchRespondents();
  }, []);

  const handleNameSort = () => {
    setSortDirection((prev) => {
      if (prev === null) return "asc";
      if (prev === "asc") return "desc";
      return null;
    });
    setCurrentPage(1); // reset to page 1 on sort change
  };

  const sortedRespondents = useMemo(() => {
    if (sortDirection === null) return respondents;
    return [...respondents].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) return sortDirection === "asc" ? -1 : 1;
      if (nameA > nameB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [respondents, sortDirection]);

  const totalPages = Math.ceil(sortedRespondents.length / PAGE_SIZE);
  const paginatedRespondents = sortedRespondents.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  // Icon
  const SortIcon =
    sortDirection === "asc"
      ? ArrowUp
      : sortDirection === "desc"
        ? ArrowDown
        : ArrowUpDown;

  return (
      <main className="w-full overflow-x-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
          <h1 className="font-black text-2xl sm:text-3xl">RESPONSES</h1>
        </div>

        <div className="w-full flex flex-col justify-center p-4 sm:p-6">
          {loading ? (
            <div className="flex w-full flex-col gap-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div className="flex gap-4 w-full" key={index}>
                  <Skeleton className="h-4 flex-1 bg-gray-200 rounded" />
                  <Skeleton className="h-4 flex-1 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : respondents.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-gray-600">No respondents found.</p>
            </Card>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Card className="w-full">
                  <div className="overflow-x-auto">
                    <Table className="bg-gray-50 border rounded-sm shadow-sm w-full">
                      <TableCaption>
                        A list of Respondents in each Barangay
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-full p-4">
                            <button
                              onClick={handleNameSort}
                              className="flex items-center gap-1 hover:text-blue-700 transition-colors font-semibold"
                            >
                              Name
                              <SortIcon className="w-4 h-4" />
                            </button>
                            <span className="text-[0.7rem]">
                              <i>(Pangalan)</i>
                            </span>
                          </TableHead>
                          <TableHead className="text-center">Barangay</TableHead>
                          <TableHead className="text-center">
                            Position in the Family <br />
                            <span className="text-[0.7rem]">
                              <i>(Posisyon sa Pamilya)</i>
                            </span>
                          </TableHead>
                          <TableHead className="text-center">
                            Number of Children <br />
                            <span className="text-[0.7rem]">
                              <i>(Bilang ng Anak)</i>
                            </span>
                          </TableHead>
                          <TableHead className="text-center">
                            Number of Families in the Household <br />
                            <span className="text-[0.7rem]">
                              <i>(Bilang ng pamilya sa bahay)</i>
                            </span>
                          </TableHead>
                          <TableHead className="text-center">
                            4P&apos;s Beneficiary <br />
                            <span className="text-[0.7rem]">
                              <i>(4P&apos;s Beneficiary ba?)</i>
                            </span>
                          </TableHead>
                          <TableHead className="text-center">
                            If YES, since when? <br />
                            <span className="text-[0.7rem]">
                              <i>(Kung OO Kailan Pa?)</i>
                            </span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedRespondents.map((r) => (
                          <TableRow key={r.respondent_id}>
                            <TableCell className="font-medium">{r.name}</TableCell>
                            <TableCell className="font-medium text-center">
                              {r.barangay}
                            </TableCell>
                            <TableCell className="font-medium text-center">
                              {r.position_family}
                            </TableCell>
                            <TableCell className="font-medium text-center">
                              {r.num_children}
                            </TableCell>
                            <TableCell className="font-medium text-center">
                              {r.num_families_in_hh}
                            </TableCell>
                            <TableCell
                              className={`font-medium text-center ${
                                r.is_4ps_beneficiary ? "text-green-500" : "text-red-500"
                              }`}
                            >
                              {r.is_4ps_beneficiary ? "Yes" : "No"}
                            </TableCell>
                            <TableCell className="font-medium text-center">
                              {r.four_ps_since ?? "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Desktop Pagination */}
                  <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 gap-4">
                    <p className="text-sm text-gray-500">
                      Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                      {Math.min(
                        currentPage * PAGE_SIZE,
                        sortedRespondents.length,
                      )}{" "}
                      of {sortedRespondents.length} respondents
                    </p>
                    <Pagination>
                      <PaginationContent className="flex flex-wrap gap-1">
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1) setCurrentPage((p) => p - 1);
                            }}
                            aria-disabled={currentPage === 1}
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>

                        {pageNumbers.map((page, index) =>
                          page === "ellipsis" ? (
                            <PaginationItem key={`ellipsis-${index}`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          ) : (
                            <PaginationItem key={page}>
                              <PaginationLink
                                href="#"
                                isActive={currentPage === page}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(page as number);
                                }}
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
                              e.preventDefault();
                              if (currentPage < totalPages)
                                setCurrentPage((p) => p + 1);
                            }}
                            aria-disabled={currentPage === totalPages}
                            className={
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </Card>
              </div>

              {/* Mobile Card View */}
              <div className="flex flex-col gap-3 md:hidden">
                {paginatedRespondents.map((r) => (
                  <Card
                    key={r.respondent_id}
                    className="p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Name with sort indicator */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg text-gray-900 flex-1 pr-2">
                        {r.name}
                      </h3>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
                          r.is_4ps_beneficiary
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {r.is_4ps_beneficiary ? "4P's" : "No"}
                      </span>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                          Barangay
                        </p>
                        <p className="font-medium text-gray-900">{r.barangay}</p>
                      </div>

                      <div>
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                          Position
                        </p>
                        <p className="font-medium text-gray-900">
                          {r.position_family}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                          Children
                        </p>
                        <p className="font-medium text-gray-900">
                          {r.num_children}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                          Families in HH
                        </p>
                        <p className="font-medium text-gray-900">
                          {r.num_families_in_hh}
                        </p>
                      </div>

                      {r.is_4ps_beneficiary && (
                        <div className="col-span-2">
                          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                            4P's Since
                          </p>
                          <p className="font-medium text-gray-900">
                            {r.four_ps_since ?? "N/A"}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Mobile Pagination */}
              <div className="md:hidden mt-6 flex flex-col gap-4">
                <p className="text-sm text-gray-600 text-center">
                  Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                  {Math.min(currentPage * PAGE_SIZE, sortedRespondents.length)}{" "}
                  of {sortedRespondents.length}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      if (currentPage > 1) setCurrentPage((p) => p - 1);
                    }}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-md bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors text-sm font-medium"
                  >
                    ← Prev
                  </button>

                  <div className="flex gap-1">
                    {pageNumbers.slice(0, 3).map((page, index) =>
                      page === "ellipsis" ? (
                        <span key={`ellipsis-${index}`} className="px-2">
                          •••
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page as number)}
                          className={`w-8 h-8 rounded-md font-medium transition-colors ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (currentPage < totalPages) setCurrentPage((p) => p + 1);
                    }}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-md bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors text-sm font-medium"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Summary Sections */}
        <div className="space-y-4 sm:space-y-6 px-4 sm:px-6 py-6">
          <BarangayResponses />
          <FamilyPositionSummary />
          <NumChildrenSummary />
          <NumFamiliesInHHSummary />
          <FourPsSummary />
          <FourPsSinceSummary />
          <PartOne />
          <PartTwo />
          <PartThree />
          <PartFour />
        </div>
      </main>
    
  );
}
