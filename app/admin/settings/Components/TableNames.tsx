
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
    <main className="mt-5">
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
      ) : filtered.length === 0 ? (
        <p>No respondents found</p>
      ) : (
        <Table className="bg-blue-50 border rounded-sm shadow-sm">
          <TableCaption>A list of Respondents in each Barangay</TableCaption>
          <TableHeader>
            <TableRow className="border border-gray-500">
              <TableHead className="w-full p-4">
                Name <span className="text-[0.7rem]"><i>(Pangalan)</i></span>
              </TableHead>
              <TableHead className="text-center">Barangay</TableHead>
              <TableHead className="text-center">View Response</TableHead>
              <TableHead className="text-center">Delete Record</TableHead>

            </TableRow>
          </TableHeader>
          <TableBody className="border border-gray-500">
            {paginatedData.map((r) => (
              <TableRow key={r.respondent_id}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell className="font-medium text-center">{r.barangay? r.barangay.charAt(0).toUpperCase() + r.barangay.slice(1): "N/A"}</TableCell>
                <TableCell className="font-medium text-center">
                  <button 
                  onClick={() => setSelectedRespondent(r)}
                  className="border-2 border-amber-500 px-4 py-2 rounded-[5px] text-[1.2rem]">
                    <IoListSharp />
                  </button>
                </TableCell>
                <TableCell className="font-medium text-center">
                  <button 
                  onClick={() => setSelectedRespondent(r)}
                  className="border-2 border-red-500 px-4 py-2 rounded-[5px] text-[1.2rem]">
                    <FaRegTrashAlt />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      )}
      
              {totalPages > 1 && (
  <div className="mt-4 flex justify-center">
    <Pagination>
      <PaginationContent>

        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() =>
              setCurrentPage((prev) => Math.max(prev - 1, 1))
            }
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1
          return (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={currentPage === page}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        })}

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

      {selectedRespondent && (
  <ResultPopUp
    respondent={selectedRespondent}
    onClose={() => setSelectedRespondent(null)}
  />
)}
    </main>
  );
}

export default TableNames;
