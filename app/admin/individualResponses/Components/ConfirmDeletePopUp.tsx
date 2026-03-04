'use client'
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";

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

type ConfirmDeletePopUpProps = {
  delRespondent: Respondent;
  onClose: () => void;
  onDeleted: (id: string) => void;
};

export default function ConfirmDeletePopUp({
  delRespondent,
  onClose,
  onDeleted
}: ConfirmDeletePopUpProps) {

const handleDelete = async () => {
  console.log("Deleting ID:", delRespondent.respondent_id);

  const { data, error } = await supabase
    .from("respondents")
    .delete()
    .eq("respondent_id", delRespondent.respondent_id)
    .select(); // 

  console.log("Result:", data);
  console.log("Error:", error);

  if (error) {
    alert(error.message);
    return;
  }
  onDeleted(delRespondent.respondent_id);
  alert("Deleted!");
  onClose();
};


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>
          Are you sure you want to delete{" "}
          <span className="font-bold">{delRespondent.name}</span>?
        </p>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
          onClick={handleDelete}
          variant="destructive">Delete</Button>
        </div>
      </div>
    </div>
  );
}
