interface CheckboxOptionProps {
  id: string;
  checked: boolean;
  onChange: () => void;
  label: string;
}

export function CheckboxOption({
  id,
  checked,
  onChange,
  label,
}: CheckboxOptionProps) {
  return (
    <label
      htmlFor={id}
      className="
        inline-flex items-center gap-2
        cursor-pointer text-slate-700
        select-none
      "
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="
          h-4 w-4 rounded
          border-slate-300
          text-teal-600
          focus:ring-teal-500
        "
      />
      <span>{label}</span>
    </label>
  );
}
