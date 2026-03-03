"use client";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";

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
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="font-semibold text-red-600">
          This will permanently delete ALL respondents and their responses.
        </p>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteAll}>
            Delete All
          </Button>
        </div>
      </div>
    </div>
  );
}
