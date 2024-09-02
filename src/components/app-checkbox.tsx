import { Checkbox } from "./ui/checkbox";

export function AppCheckbox({
  id,
  label,
  checked,
  onCheckedChange,
}: AppCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  );
}

type AppCheckboxProps = {
  label: string;
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};
