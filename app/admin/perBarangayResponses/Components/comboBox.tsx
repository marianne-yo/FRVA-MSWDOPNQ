"use client"

import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox"
import { Barangay,barangay } from "@/app/lib/barangay"


type ComboboxPopupProps = {
  value: Barangay | null
  onChange: (value: Barangay | null) => void
}

export function ComboboxPopup({value, onChange}:ComboboxPopupProps) {
  return (
    <>
      <Combobox items={barangay}
       defaultValue={barangay[0]}
      //  value={value}
       onValueChange={onChange}
       >
        <ComboboxTrigger render={<Button variant="outline" className="w-64 justify-between font-normal"><ComboboxValue /></Button>} />
        <ComboboxContent>
          <ComboboxInput showTrigger={false} placeholder="Search" />
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.code} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </>
  )
}
