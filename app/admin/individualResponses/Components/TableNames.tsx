"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { IoListSharp } from "react-icons/io5"
import ResultPopUp from "./Result-PopUp";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { FaRegTrashAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ConfirmDeletePopUp from "./ConfirmDeletePopUp";

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

function TableNames({ search }: { search: string }) {
  const [data, setData] = useState<Respondent[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [selectedRespondent, setSelectedRespondent] = useState<Respondent | null>(null);
  const [Delete, setDelete] = useState<Respondent | null>(null);

  useEffect(() => {
    const fetchRespondents = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("respondents").select(`
        respondent_id, name, position_family, num_children,
        num_families_in_hh, is_4ps_beneficiary, four_ps_since, barangay`);

      if (error) {
        console.error("Error fetching respondents:", error.message);
        setData([]);
      } else {
        setData(data || []);
      }
      setLoading(false);
    };

    fetchRespondents();
  }, []);

  // Filter by name client-side
  const filtered = data.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  return (
    <main className="w-full px-2 sm:px-4 py-4">
      {loading ? (
        <div className="flex w-full flex-col gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div className="flex gap-4 w-full" key={index}>
              <Skeleton className="h-4 flex-1 bg-gray-200 rounded" />
              <Skeleton className="h-4 flex-1 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-6 text-center bg-blue-50">
          <p className="text-gray-600">No respondents found</p>
        </Card>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table className="bg-blue-100/10 rounded-lg shadow-sm w-full">
              <TableCaption>A list of Respondents in each Barangay</TableCaption>
              <TableHeader>
                <TableRow className="rounded-t-lg">
                  <TableHead className="w-full p-4 sm:p-6">
                    Name <span className="text-[0.7rem]"><i>(Pangalan)</i></span>
                  </TableHead>
                  <TableHead className="text-center p-4 sm:p-6">Barangay</TableHead>
                  <TableHead className="text-center p-4 sm:p-6">View Response</TableHead>
                  <TableHead className="text-center p-4 sm:p-6">Delete Record</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedData.map((r) => (
                  <TableRow key={r.respondent_id}>
                    <TableCell className="font-medium text-[0.95rem] px-4 sm:px-6">{r.name}</TableCell>
                    <TableCell className="font-medium text-center text-[0.95rem]">
                      {r.barangay ? r.barangay.charAt(0).toUpperCase() + r.barangay.slice(1) : "N/A"}
                    </TableCell>
                    <TableCell className="font-medium text-center">
                      <Button
                        variant={"outline"}
                        size={"icon-lg"}
                        onClick={() => setSelectedRespondent(r)}
                        className="border-amber-200 px-4 py-2 rounded-[5px] text-[1.2rem] cursor-pointer hover:bg-amber-50"
                      >
                        <IoListSharp />
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium text-center">
                      <Button
                        variant={"destructive"}
                        size={"icon-lg"}
                        onClick={() => setDelete(r)}
                        className="bg-red-500 px-4 py-2 rounded-[5px] text-[1.2rem] cursor-pointer hover:bg-red-600"
                      >
                        <FaRegTrashAlt />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col gap-3">
            {paginatedData.map((r) => (
              <Card
                key={r.respondent_id}
                className="p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Name */}
                <div className="mb-3">
                  <h3 className="font-bold text-base sm:text-lg text-gray-900">
                    {r.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">(Pangalan)</p>
                </div>

                {/* Barangay */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Barangay</p>
                  <p className="text-sm font-medium text-gray-900">
                    {r.barangay ? r.barangay.charAt(0).toUpperCase() + r.barangay.slice(1) : "N/A"}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant={"outline"}
                    onClick={() => setSelectedRespondent(r)}
                    className="flex-1 border-amber-200 hover:bg-amber-50 rounded-md py-2 font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <IoListSharp className="text-lg" />
                    View Response
                  </Button>
                  <Button
                    variant={"destructive"}
                    onClick={() => setDelete(r)}
                    className="flex-1 bg-red-500 hover:bg-red-600 rounded-md py-2 font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <FaRegTrashAlt className="text-lg" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center overflow-x-auto">
              <Pagination>
                <PaginationContent className="flex flex-wrap gap-1">
                  {/* Previous */}
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {/* Page Numbers - Simplified on mobile */}
                  {totalPages <= 5 ? (
                    // Show all page numbers if 5 or fewer
                    Array.from({ length: totalPages }).map((_, index) => {
                      const page = index + 1
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={currentPage === page}
                            onClick={() => setCurrentPage(page)}
                            className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    })
                  ) : (
                    // Show smart pagination on mobile
                    <>
                      {currentPage > 2 && (
                        <>
                          <PaginationItem>
                            <PaginationLink
                              isActive={currentPage === 1}
                              onClick={() => setCurrentPage(1)}
                              className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                            >
                              1
                            </PaginationLink>
                          </PaginationItem>
                          {currentPage > 3 && (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}
                        </>
                      )}

                      {/* Current page and neighbors */}
                      {Array.from({ length: 3 }).map((_, offset) => {
                        const page = currentPage - 1 + offset
                        if (page > 0 && page <= totalPages) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                isActive={currentPage === page}
                                onClick={() => setCurrentPage(page)}
                                className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        }
                        return null
                      })}

                      {currentPage < totalPages - 1 && (
                        <>
                          {currentPage < totalPages - 2 && (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}
                          <PaginationItem>
                            <PaginationLink
                              isActive={currentPage === totalPages}
                              onClick={() => setCurrentPage(totalPages)}
                              className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                            >
                              {totalPages}
                            </PaginationLink>
                          </PaginationItem>
                        </>
                      )}
                    </>
                  )}

                  {/* Next */}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages)
                        )
                      }
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
          )}
        </>
      )}

      {selectedRespondent && (
        <ResultPopUp
          respondent={selectedRespondent}
          onClose={() => setSelectedRespondent(null)}
        />
      )}

      {Delete && (
        <ConfirmDeletePopUp
          delRespondent={Delete}
          onClose={() => setDelete(null)}
          onDeleted={(id) => {
            setData((prev) =>
              prev.filter((r) => r.respondent_id !== id)
            );
          }}
        />
      )}
    </main>
  );
}

export default TableNames;
