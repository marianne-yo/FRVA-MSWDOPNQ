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

import {Card} from "@/components/ui/card";
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
  }, []); //

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
    <div>
      <main>
        <h1 className="font-black text-3xl py-5 px-2">RESPONSES</h1>
        <div className="p-3 w-full flex flex-col justify-center">
          <Separator />
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
            <Card className="w-full max-w-7xl mx-auto px-5 bg-gradient-to-b from-gray-50 to-gray-100 mt-4 mb-2">
              <div className="min-h-[500px] w-full overflow-x-auto">
                <Table className="bg-gray-50 border rounded-sm shadow-sm w-full min-w-[900px]">
                  <TableCaption>
                    A list of Respondents in each Barangay
                  </TableCaption>
                  <TableHeader>
                    <TableRow className="">
                      {/* Sortable Name column */}
                      <TableHead className="w-full p-4">
                        <button
                          onClick={handleNameSort}
                          className="flex items-center gap-1 hover:text-blue-700 transition-colors font-semibold">
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
                      <TableHead className="text-center ">
                        4P&apos;s Beneficiary <br />
                        <span className="text-[0.7rem]">
                          <i>(4P&apos;s Beneficiary ba?)</i>
                        </span>
                      </TableHead>
                      <TableHead className="text-center ">
                        If YES, since when? <br />
                        <span className="text-[0.7rem]">
                          <i>(Kung OO Kailan Pa?)</i>
                        </span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="">
                    {paginatedRespondents.map((r) => (
                      <TableRow key={r.respondent_id}>
                        <TableCell className="font-medium">{r.name}</TableCell>
                        <TableCell className="font-medium text-center">
                          {r.barangay}
                        </TableCell>
                        <TableCell className="font-medium text-center ">
                          {r.position_family}
                        </TableCell>
                        <TableCell className="font-medium text-center">
                          {r.num_children}
                        </TableCell>
                        <TableCell className="font-medium text-center">
                          {r.num_families_in_hh}
                        </TableCell>
                        <TableCell
                          className={`font-medium text-center ${r.is_4ps_beneficiary ? "text-green-500" : "text-red-500   "}`}
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

              {/* Pagination */}
              <div className="flex items-center justify-between px-2">
                <Pagination className=" flex justify-between">
                  <p className="text-sm text-gray-500 ">
                    Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                    {Math.min(
                      currentPage * PAGE_SIZE,
                      sortedRespondents.length,
                    )}{" "}
                    of {sortedRespondents.length} respondents
                  </p>
                  <PaginationContent>
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
                              setCurrentPage(page);
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
          )}
        </div>

        <BarangayResponses/>
        <FamilyPositionSummary/>
        <NumChildrenSummary/>
        <NumFamiliesInHHSummary/>
        <FourPsSummary/>
        <FourPsSinceSummary/>
        <PartOne></PartOne>
        <PartTwo/>
        <PartThree/>
        <PartFour/>
      </main>
    </div>
  );
}
