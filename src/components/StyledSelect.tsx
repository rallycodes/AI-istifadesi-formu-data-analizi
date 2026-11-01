import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function StyledSelect({
  label,
  value,
  onChange,
  options,
  all = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  all?: boolean;
}) {
  return (
    <Select
      value={value || "__all__"}
      onValueChange={(next) => onChange(next === "__all__" ? "" : next)}
    >
      <SelectTrigger aria-label={label} className="styled-select">
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        position="popper"
        align="start"
        className="styled-select-menu"
        sideOffset={5}
      >
        {all && <SelectItem value="__all__">Hamısı</SelectItem>}
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
