import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  onChange: (val: string) => void;
};

export function InputInline({ value, onChange }: Props) {
  return (
    <Field orientation="horizontal">
      <Input
        type="search"
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <Button onClick={() => onChange(value)}>Search</Button>
    </Field>
  );
}