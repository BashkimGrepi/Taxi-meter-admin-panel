type Props = {
  value: string;           // "YYYY-MM"
  onChange: (mm: string) => void;
  label?: string;
};

export default function MonthPicker({ value, onChange, label = 'Month' }: Props) {
  return (
    <label className="text-sm">
      {label}
      <input
        type="month"
        className="mt-1 w-full border rounded p-2"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </label>
  );
}
