"use client";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";

import {
  AlertTriangle
} from "lucide-react"

type Props = {
  onClose: () => void;
};

export default function NukeDelete({ onClose }: Props) {
  const handleDeleteAll = async () => {
    const { error } = await supabase
      .from("respondents")
      .delete()
      .neq("respondent_id", ""); // delete everything

    if (error) {
      alert(error.message);
      return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md border-2 border-red-300">
        <div className="flex items-center justify-center mb-2">
          <AlertTriangle className="text-red-500" size={60} />
        </div>
        <p className="font-semibold text-black text-center">
          This will permanently delete <span className="font-black text-red-500">ALL respondents</span> and their responses.
        </p>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} className="cursor-pointer ">
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteAll} className="cursor-pointer hover:bg-red-800">
            Delete All
          </Button>
        </div>
      </div>
    </div>
  );
}
